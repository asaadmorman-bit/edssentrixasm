import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { period_label, period_start, period_end, licenses = [] } = body;

    // Build a prompt for the compliance report
    const licensesSummary = licenses.length > 0
      ? licenses.map(l => `  - ${l.organization_name || 'Your Org'}: ${(l.product || '').replace(/_/g, ' ')} | Seats: ${l.seats_used ?? 0}/${l.seats_licensed ?? 1} | Status: ${l.status}`).join('\n')
      : '  - No active licenses on record.';

    const prompt = `
Generate a professional monthly compliance report for a security services client using the following data.

Report Period: ${period_label} (${period_start} to ${period_end})
Client User: ${user.full_name || user.email}
Generated On: ${new Date().toISOString().split('T')[0]}

Active Licenses:
${licensesSummary}

Write a formal compliance report with the following sections:
1. Executive Summary (2-3 sentences)
2. License Compliance Status (reference the licenses above, confirm compliance)
3. Security Posture Overview (general best practices observed for the period)
4. Regulatory Alignment (reference relevant frameworks: HIPAA if medical, SOC 2, NIST CSF, as applicable)
5. Recommendations for Next Period (3 bullet points)
6. Report Certification (state this is an auto-generated report by Emerging Defense Solutions / EDS Sentrix ASM)

Keep the tone formal and professional. Use plain text, no markdown. Each section should be clearly labeled.
    `.trim();

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    const header = [
      '══════════════════════════════════════════════════════════',
      '         EDS SENTRIX ASM — MONTHLY COMPLIANCE REPORT',
      '══════════════════════════════════════════════════════════',
      `  Report Period : ${period_label}`,
      `  Prepared For  : ${user.full_name || user.email}`,
      `  Generated On  : ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST`,
      `  Issued By     : Emerging Defense Solutions`,
      '══════════════════════════════════════════════════════════',
      '',
    ].join('\n');

    const content = header + result;

    return Response.json({ content, period: period_label });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});