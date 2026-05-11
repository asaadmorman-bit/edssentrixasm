import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, companySize, source } = await req.json();

    if (!email || !name) {
      return Response.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('hubspot');

    // Search for existing contact by email first
    const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
        limit: 1,
      }),
    });

    const searchData = await searchRes.json();
    const existingId = searchData.results?.[0]?.id;

    const contactPayload = {
      properties: {
        firstname: name.split(' ')[0] || name,
        lastname: name.split(' ').slice(1).join(' ') || '',
        email,
        company: companySize ? `Company Size: ${companySize}` : '',
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        lead_source: source || 'EDS Sentrix Waitlist',
      },
    };

    let result;
    if (existingId) {
      const updateRes = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactPayload),
      });
      result = await updateRes.json();
    } else {
      const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactPayload),
      });
      result = await createRes.json();
    }

    return Response.json({ success: true, contactId: result.id, action: existingId ? 'updated' : 'created' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});