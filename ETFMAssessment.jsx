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

  // ─── Mailchimp + Claude handler ──────────────────────────────────────────────
  if (type === "subscribe") {
    const { firstName, email, answers } = body;

    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
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
5. Their Matrix Score — calculate a score from 0-100 based on their answers and show it clearly (higher scores = more financial awareness/control)
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
      snapshotHtml = `<p>Hi ${firstName},</p><p>Thank you for completing the ETFM Financial Snapshot assessment. Your personalized results are being prepared — watch for a follow-up from Robert with your full analysis.</p>`;
    }

    // ── 3. Send email via Resend HTTP API ────────────────────────────────────
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Your ETFM Financial Snapshot</title>
          </head>
          <body style="margin:0;padding:0;background-color:#f7f4ef;font-family:'DM Sans',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f4ef;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e3da;">

                    <!-- Header -->
                    <tr>
                      <td style="background-color:#1a1a2e;padding:32px 40px;text-align:center;">
                        <img src="https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/file_00000000e10471f5bb36fabf63d29869.png"
                             alt="ETFM Logo" width="120" style="display:block;margin:0 auto 16px;" />
                        <h1 style="margin:0;color:#c9973a;font-size:22px;font-family:Georgia,serif;letter-spacing:1px;">
                          Your Financial Matrix Snapshot
                        </h1>
                      </td>
                    </tr>

                    <!-- Snapshot Content -->
                    <tr>
                      <td style="padding:40px;color:#1a1a2e;font-size:15px;line-height:1.7;">
                        ${snapshotHtml}
                      </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                      <td style="padding:0 40px 40px;text-align:center;">
                        <p style="color:#7a7a8a;font-size:14px;margin-bottom:24px;">
                          Ready to break free from the financial matrix?
                        </p>
                        <a href="https://buy.stripe.com/9B6dRad5653g7d77028Vi0b"
                           style="display:inline-block;background-color:#c9973a;color:#1a1a2e;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:15px;margin-bottom:12px;">
                          Get Your Full Blueprint — $47
                        </a>
                        <br />
                        <a href="https://buy.stripe.com/7sY14o7KMbrE693ckm8Vi0c"
                           style="display:inline-block;margin-top:12px;color:#c9973a;font-size:13px;text-decoration:underline;">
                          Or book a 1-on-1 Strategy Session ($499)
                        </a>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color:#f7f4ef;padding:24px 40px;text-align:center;border-top:1px solid #e8e3da;">
                        <p style="margin:0;color:#7a7a8a;font-size:12px;">
                          Questions? Reply to this email or reach us at
                          <a href="mailto:info@etfm.systems" style="color:#c9973a;">info@etfm.systems</a>
                        </p>
                        <p style="margin:8px 0 0;color:#7a7a8a;font-size:11px;">
                          © ${new Date().getFullYear()} Escape The Financial Matrix. All rights reserved.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ETFM Assessment <noreply@etfm.systems>",
          to: email,
          subject: `${firstName}, your Financial Matrix Snapshot is here`,
          html: emailHtml,
        }),
      });

      const resendData = await resendRes.json();
      if (!resendRes.ok) {
        console.error("Resend error:", resendData);
      } else {
        console.log(`Email sent to ${email}`);
      }
    } catch (err) {
      console.error("Resend email error:", err);
    }

    return res.status(200).json({ success: true, snapshot: snapshotHtml });
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
