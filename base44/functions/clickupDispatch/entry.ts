import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Uses the "EDS Manager" app-user ClickUp connector (id: 69ed7eeab69fd772056b323c)
const CONNECTOR_ID = '69ed7eeab69fd772056b323c';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serviceType, serviceName, address, date, notes, priority, requestorName } = await req.json();

    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);

    // Get available spaces to find a list to post to
    const spacesRes = await fetch('https://api.clickup.com/api/v2/team', {
      headers: { 'Authorization': accessToken },
    });
    const spacesData = await spacesRes.json();
    const teamId = spacesData.teams?.[0]?.id;

    if (!teamId) {
      return Response.json({ error: 'No ClickUp team found. Please ensure EDS Manager is connected.' }, { status: 400 });
    }

    // Get spaces
    const spaceRes = await fetch(`https://api.clickup.com/api/v2/team/${teamId}/space?archived=false`, {
      headers: { 'Authorization': accessToken },
    });
    const spaceData = await spaceRes.json();
    const spaceId = spaceData.spaces?.[0]?.id;

    if (!spaceId) {
      return Response.json({ error: 'No ClickUp space found.' }, { status: 400 });
    }

    // Get lists in first space
    const listRes = await fetch(`https://api.clickup.com/api/v2/space/${spaceId}/list?archived=false`, {
      headers: { 'Authorization': accessToken },
    });
    const listData = await listRes.json();
    const listId = listData.lists?.[0]?.id;

    if (!listId) {
      return Response.json({ error: 'No ClickUp list found.' }, { status: 400 });
    }

    const isHighPriority = priority === 'high' || serviceName?.includes('Executive Protection') || serviceName?.includes('Drone');
    const taskPriority = isHighPriority ? 1 : 3; // 1=urgent, 2=high, 3=normal, 4=low

    const taskPayload = {
      name: `[EDS Dispatch] ${serviceType} — ${serviceName}`,
      description: `**Dispatch Request from EDS Sentrix ASM**\n\n**Service Type:** ${serviceType}\n**Service:** ${serviceName}\n**Requestor:** ${requestorName || user.full_name || user.email}\n**Address / Location:** ${address || 'Not specified'}\n**Requested Date/Time:** ${date || 'Earliest available'}\n**Special Instructions:**\n${notes || 'None'}\n\n---\n*Submitted via EDS Sentrix ASM Dispatch Center*`,
      priority: taskPriority,
      tags: ['eds-dispatch', serviceType.toLowerCase().replace(/\s+/g, '-')],
    };

    const taskRes = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        'Authorization': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskPayload),
    });

    const taskData = await taskRes.json();

    if (taskData.err) {
      return Response.json({ error: taskData.err }, { status: 400 });
    }

    return Response.json({
      success: true,
      taskId: taskData.id,
      taskUrl: taskData.url,
      taskName: taskData.name,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});