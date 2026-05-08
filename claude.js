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

  // ─── Mailchimp subscriber + Resend email handler ─────────────────────────────
  if (type === "subscribe") {
    const { firstName, email, answers } = body;

    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const dc = MAILCHIMP_API_KEY.split("-").pop();

    // ── 1. Add to Mailchimp ──────────────────────────────────────────────────
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
            merge_fields: { FNAME: firstName },
            tags: ["ETFM Assessment"],
          }),
        }
      );

      const mcData = await mcRes.json();
      if (!mcRes.ok && mcData.title !== "Member Exists") {
        console.error("Mailchimp error:", mcData);
      }
    } catch (err) {
      console.error("Mailchimp error:", err);
    }

    // ── 2. Generate snapshot with Claude ────────────────────────────────────
    let snapshotHtml = "";
    try {
      const answersText = answers
        ? answers.map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`).join("\n\n")
        : "No answers provided.";

      const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-opus-4-5",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `You are a financial coach for the ETFM (Escape The Financial Matrix) program. Based on the following assessment answers, write a personalized Financial Snapshot for ${firstName}.

${answersText}

Write the snapshot in HTML format suitable for an email. Include:
1. A warm, personalized greeting using their first name
2. Their Financial Identity label (e.g. "The Reactive Spender", "The Aware but Stuck", "The Disciplined Builder" — pick the most fitting one based on their answers)
3. One key system insight about their financial patterns (2-3 sentences, specific to their answers)
4. One immediate action step they can take this week (concrete and specific)
5. A note that their full Matrix Score is revealed in this email — calculate a score from 0-100 based on their answers and show it clearly (higher scores = more financial awareness/control)
6. A closing line encouraging them to go deeper

Use a professional but warm tone. Format with simple HTML — headings, paragraphs, bold text. No CSS styles needed. Keep it under 400 words total.`,
            },
          ],
        }),
      });

      const claudeData = await claudeRes.json();
      snapshotHtml = claudeData?.content?.[0]?.text || "";
    } catch (err) {
      console.error("Claude snapshot error:", err);
      snapshotHtml = `<p>Hi ${firstName},</p><p>Thank you for completing the ETFM Financial Snapshot assessment. Your results are being processed — watch for a follow-up from Robert with your full analysis.</p>`;
    }

    // ── 3. Send email via Resend ─────────────────────────────────────────────
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Robert Brickey <info@etfm.systems>",
          to: [email],
          subject: `${firstName}, your ETFM Financial Snapshot is here`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #f7f4ef; color: #1a1a2e;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 28px; color: #c9973a; letter-spacing: 0.1em; margin: 0;">ETFM</h1>
    <p style="font-size: 12px; color: #7a7a8a; letter-spacing: 0.2em; text-transform: uppercase; margin: 4px 0 0;">Escape The Financial Matrix</p>
  </div>
  <div style="background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e8e3da;">
    ${snapshotHtml}
  </div>
  <div style="margin-top: 32px; padding: 24px; background: #1a1a2e; border-radius: 16px; text-align: center;">
    <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0 0 16px;">Ready to go deeper into your financial system?</p>
    <a href="https://buy.stripe.com/9B6dRad5653g7d77028Vi0b" style="display: inline-block; background: #c9973a; color: #1a1a2e; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 15px;">Get Your Full Blueprint — $47 →</a>
    <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 16px 0 0;">Or book a 1-on-1 Strategic Reset Session with Robert at <a href="https://buy.stripe.com/7sY14o7KMbrE693ckm8Vi0c" style="color: #c9973a;">$499</a></p>
  </div>
  <p style="text-align: center; color: #7a7a8a; font-size: 11px; margin-top: 24px;">© ETFM · Escape The Financial Matrix · <a href="mailto:info@etfm.systems" style="color: #7a7a8a;">info@etfm.systems</a></p>
</body>
</html>`,
        }),
      });

      const emailData = await emailRes.json();
      if (!emailRes.ok) {
        console.error("Resend error:", emailData);
        return res.status(500).json({ error: "Failed to send email" });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Email send failed" });
    }
  }

  // ─── Claude AI direct handler ────────────────────────────────────────────────
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
