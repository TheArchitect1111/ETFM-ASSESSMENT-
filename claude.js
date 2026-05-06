export default async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, ...body } = req.body;

  // ─── Mailchimp subscriber handler ───────────────────────────────────────────
  if (type === "subscribe") {
    const { firstName, email } = body;

    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const dc = MAILCHIMP_API_KEY.split("-").pop(); // e.g. "us7"

    try {
      const mcRes = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
          },
          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
            },
            tags: ["ETFM Assessment"],
          }),
        }
      );

      const mcData = await mcRes.json();

      // Member already exists — that's fine, not an error
      if (!mcRes.ok && mcData.title !== "Member Exists") {
        console.error("Mailchimp error:", mcData);
        return res.status(500).json({ error: "Failed to subscribe to Mailchimp" });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Mailchimp error:", err);
      return res.status(500).json({ error: "Mailchimp connection failed" });
    }
  }

  // ─── Claude AI snapshot handler ──────────────────────────────────────────────
  try {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Claude API error:", err);
    return res.status(500).json({ error: "Claude API call failed" });
  }
}
