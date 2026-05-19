import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { differenceInDays, parseISO, format } from 'npm:date-fns@3.6.0';

const CONNECTOR_ID = '69ed7eeab69fd772056b323c'; // EDS Manager ClickUp connector

async function getClickUpListId(accessToken) {
  const teamRes = await fetch('https://api.clickup.com/api/v2/team', {
    headers: { Authorization: accessToken },
  });
  const teamData = await teamRes.json();
  const teamId = teamData.teams?.[0]?.id;
  if (!teamId) throw new Error('No ClickUp team found');

  const spaceRes = await fetch(`https://api.clickup.com/api/v2/team/${teamId}/space?archived=false`, {
    headers: { Authorization: accessToken },
  });
  const spaceData = await spaceRes.json();
  const spaceId = spaceData.spaces?.[0]?.id;
  if (!spaceId) throw new Error('No ClickUp space found');

  const listRes = await fetch(`https://api.clickup.com/api/v2/space/${spaceId}/list?archived=false`, {
    headers: { Authorization: accessToken },
  });
  const listData = await listRes.json();
  const listId = listData.lists?.[0]?.id;
  if (!listId) throw new Error('No ClickUp list found');

  return listId;
}

async function createTask(accessToken, listId, name, description, priority = 2, tags = []) {
  const res = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: 'POST',
    headers: { Authorization: accessToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, priority, tags }),
  });
  return res.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow both scheduled automations (no user) and manual admin calls
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const mode = body.mode || 'report'; // 'report' | 'suspend_check'

    // Use service role to retrieve the connector — works for both scheduled and user-triggered runs
    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);
    const listId = await getClickUpListId(accessToken);

    const [orgs, licenses] = await Promise.all([
      base44.asServiceRole.entities.Organization.list('-created_date', 200),
      base44.asServiceRole.entities.License.list('-created_date', 500),
    ]);

    const today = new Date();
    const orgMap = Object.fromEntries(orgs.map(o => [o.id, o]));

    const results = { tasksCreated: [], suspended: [] };

    if (mode === 'report' || mode === 'all') {
      // ── SUBSCRIPTION & USAGE REPORT TASK ─────────────────────────────────────
      const activeOrgs = orgs.filter(o => o.status === 'active' || o.status === 'trial');
      const totalMRR = orgs.filter(o => o.status === 'active').reduce((s, o) => s + (o.monthly_revenue || 0), 0);

      let reportLines = `**📊 EDS Sentrix ASM — Billing & Subscription Report**\n`;
      reportLines += `*Generated: ${format(today, 'MMMM d, yyyy')}*\n\n`;
      reportLines += `**Summary**\n`;
      reportLines += `• Total Organizations: ${orgs.length}\n`;
      reportLines += `• Active: ${orgs.filter(o => o.status === 'active').length}  |  Trial: ${orgs.filter(o => o.status === 'trial').length}  |  Suspended: ${orgs.filter(o => o.status === 'suspended').length}\n`;
      reportLines += `• Total MRR: $${totalMRR.toLocaleString()}\n`;
      reportLines += `• Total Licenses: ${licenses.length}  |  Active: ${licenses.filter(l => l.status === 'active').length}\n\n`;

      // Usage per org
      reportLines += `**Per-Organization Seat Usage**\n`;
      for (const org of activeOrgs) {
        const orgLics = licenses.filter(l => l.organization_id === org.id && l.status === 'active');
        if (!orgLics.length) continue;
        const totalSeats = orgLics.reduce((s, l) => s + (l.seats_licensed || 0), 0);
        const usedSeats = orgLics.reduce((s, l) => s + (l.seats_used || 0), 0);
        const util = totalSeats > 0 ? Math.round((usedSeats / totalSeats) * 100) : 0;
        reportLines += `• ${org.name}: ${usedSeats}/${totalSeats} seats (${util}%) — $${(org.monthly_revenue || 0).toLocaleString()}/mo\n`;
      }

      // Expiration warnings
      const expiring = licenses
        .filter(l => l.valid_until && l.status === 'active')
        .map(l => ({ ...l, daysLeft: differenceInDays(parseISO(l.valid_until), today) }))
        .filter(l => l.daysLeft >= 0 && l.daysLeft <= 30)
        .sort((a, b) => a.daysLeft - b.daysLeft);

      if (expiring.length) {
        reportLines += `\n**⚠️ Expiring in ≤30 Days (${expiring.length} licenses)**\n`;
        for (const l of expiring) {
          reportLines += `• ${l.organization_name || l.organization_id} — ${l.product?.replace(/_/g, ' ')} — expires in ${l.daysLeft}d (${format(parseISO(l.valid_until), 'MMM d')})\n`;
        }
      }

      const reportTask = await createTask(
        accessToken,
        listId,
        `[EDS Billing] Subscription & Usage Report — ${format(today, 'MMM d, yyyy')}`,
        reportLines,
        3, // normal priority
        ['billing-report', 'eds-asm']
      );
      results.tasksCreated.push({ type: 'report', taskId: reportTask.id, taskUrl: reportTask.url });
    }

    if (mode === 'suspend_check' || mode === 'all') {
      // ── SUSPENSION CHECK — Payment overdue > 10 days ─────────────────────────
      // We treat orgs where next_billing_date is > 10 days in the past as overdue.
      const overdue = orgs.filter(o => {
        if (!o.next_billing_date || o.status === 'suspended' || o.status === 'churned') return false;
        const daysPastDue = differenceInDays(today, parseISO(o.next_billing_date));
        return daysPastDue >= 10;
      });

      for (const org of overdue) {
        const daysPastDue = differenceInDays(today, parseISO(org.next_billing_date));

        // Suspend the organization
        await base44.asServiceRole.entities.Organization.update(org.id, { status: 'suspended' });

        // Revoke all active licenses for this org
        const orgLics = licenses.filter(l => l.organization_id === org.id && l.status === 'active');
        await Promise.all(orgLics.map(l =>
          base44.asServiceRole.entities.License.update(l.id, { status: 'revoked' })
        ));

        // Create a suspension task in ClickUp
        const suspendDesc = `**🚨 AUTO-SUSPENSION: Payment Overdue**\n\n` +
          `**Organization:** ${org.name}\n` +
          `**Contact:** ${org.contact_name || 'N/A'} — ${org.contact_email || 'N/A'}\n` +
          `**Plan:** ${org.plan} | ${org.billing_cycle}\n` +
          `**Monthly Revenue:** $${(org.monthly_revenue || 0).toLocaleString()}\n` +
          `**Last Billing Date:** ${format(parseISO(org.next_billing_date), 'MMMM d, yyyy')}\n` +
          `**Days Overdue:** ${daysPastDue}\n\n` +
          `**Action Taken:** Organization suspended. ${orgLics.length} license(s) revoked.\n\n` +
          `**Next Steps:**\n` +
          `- Contact client to collect payment\n` +
          `- Re-activate org and re-issue licenses once payment received\n` +
          `- Update next_billing_date in Admin Dashboard\n\n` +
          `*Auto-generated by EDS Sentrix ASM on ${format(today, 'MMMM d, yyyy')}*`;

        const suspendTask = await createTask(
          accessToken,
          listId,
          `[EDS URGENT] Auto-Suspended: ${org.name} — ${daysPastDue}d Overdue`,
          suspendDesc,
          1, // urgent
          ['auto-suspension', 'overdue-payment', 'eds-asm']
        );

        results.suspended.push({ orgId: org.id, orgName: org.name, daysPastDue, taskUrl: suspendTask.url });
      }

      if (overdue.length === 0) {
        // Log a "clean" task for audit trail
        const cleanTask = await createTask(
          accessToken,
          listId,
          `[EDS Billing] Payment Check — All Clear — ${format(today, 'MMM d, yyyy')}`,
          `✅ All organizations are current on payments as of ${format(today, 'MMMM d, yyyy')}.\nNo suspensions required.`,
          4, // low priority
          ['billing-check', 'eds-asm']
        );
        results.tasksCreated.push({ type: 'payment_check_clean', taskId: cleanTask.id, taskUrl: cleanTask.url });
      }
    }

    return Response.json({ success: true, ...results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});