// api/claude.js
// Handles both Claude AI calls and Mailchimp email subscription

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.body;

  // Handle Mailchimp subscription
  if (type === 'subscribe') {
    const { email, firstName } = req.body;
    const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
    const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const datacenter = mailchimpApiKey.split('-')[1];

    try {
      const response = await fetch(
        `https://${datacenter}.api.mailchimp.com/3.0/lists/${mailchimpAudienceId}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`anystring:${mailchimpApiKey}`).toString('base64')}`,
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            merge_fields: {
              FNAME: firstName,
            },
          }),
        }
      );
      const data = await response.json();
      if (response.ok || data.title === 'Member Exists') {
        return res.status(200).json({ success: true });
      }
      return res.status(400).json({ error: data.detail || 'Subscription failed' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to subscribe' });
    }
  }

  // Handle Claude AI call
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reach Anthropic API' });
  }
}
