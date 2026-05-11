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
          max_tokens: 2048,
          messages: [
            {
              role: "user",
              content: `You are Robert Brickey, a licensed financial advisor with Prudential and the creator of ETFM (Escape The Financial Matrix). You speak with authority, warmth, and real talk — not generic advice. You've worked with people who feel stuck, overwhelmed, and behind, and you know how to meet them where they are.

Based on the following assessment answers from ${firstName}, write their personalized Financial Snapshot email body in HTML. This is the content section only — no <html>, <head>, or <body> tags.

ASSESSMENT ANSWERS:
${answersText}

Write the content in this EXACT order using simple inline-styled HTML:

1. GREETING
   A warm, direct 2-sentence opening using their first name. Acknowledge what it took to be honest with themselves today.

2. FINANCIAL IDENTITY LABEL
   Assign them one of these identities based on their answers — pick the most accurate fit:
   "The Reactive Survivor" | "The Aware but Stuck" | "The Motivated but Directionless" | "The Inconsistent Starter" | "The Avoidant" | "The Disciplined Builder"
   Display it prominently. Write 2-3 sentences explaining what this identity means and why it fits them specifically based on their answers. Be specific — reference what they said.

3. MATRIX SCORE
   Calculate a score from 0–100 based on their answers (higher = more awareness and control). Show it as:
   <h2 style="color:#c9973a;font-size:36px;margin:24px 0 8px;">Your Matrix Score: [XX]/100</h2>
   Follow with 2 sentences interpreting what this score means for them right now — honest but encouraging.

4. KEY PATTERN INSIGHT
   Write 3–4 sentences identifying the core financial pattern their answers reveal. Be specific. Name the cycle they're in. Don't be generic — connect it directly to their answers about money flow, habits, and mindset.

5. YOUR STRENGTH
   Reference the strength they identified. 2 sentences affirming it and connecting it specifically to their financial journey — this is real, not flattery.

6. ONE ACTION STEP THIS WEEK
   Give one concrete, specific action they can take in the next 7 days. Make it achievable. Name the exact thing to do — not vague advice like "make a budget." Something like "Open a separate savings account this week and move $25 into it — even if it's all you have. Name it your Freedom Fund."

7. CLOSING LINE
   One powerful sentence that creates forward momentum. Something that feels like a coach who believes in them.

Tone: Warm, direct, real. Like a trusted advisor who has seen this before and knows the way out. Never preachy. Never generic. Always specific to their answers.
Use simple HTML: <h3>, <p>, <strong>, <hr style="border:none;border-top:1px solid #e8e3da;margin:28px 0;"> between sections. Inline styles only. Keep total under 550 words.`,
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

                    <!-- Divider -->
                    <tr>
                      <td style="padding:0 40px;">
                        <hr style="border:none;border-top:2px solid #e8e3da;margin:0;" />
                      </td>
                    </tr>

                    <!-- $47 Blueprint Offer -->
                    <tr>
                      <td style="padding:40px;background-color:#1a1a2e;text-align:center;">
                        <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Want to go deeper?</p>
                        <h2 style="color:#ffffff;font-family:Georgia,serif;font-size:22px;margin:0 0 16px;line-height:1.4;">
                          Get Your Full Financial Blueprint
                        </h2>
                        <p style="color:#a0a0b8;font-size:14px;margin:0 0 20px;line-height:1.7;">
                          Your snapshot shows <em>where</em> you are. The Blueprint takes you through 10 deeper questions — then delivers a personalized escape roadmap, the 3 financial systems you need to build first, and Robert's exact framework for breaking the cycle.
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                          <tr>
                            <td style="padding:4px 0;color:#c8c8d8;font-size:13px;">✓ &nbsp;10-question deep-dive diagnostic</td>
                          </tr>
                          <tr>
                            <td style="padding:4px 0;color:#c8c8d8;font-size:13px;">✓ &nbsp;Personalized step-by-step escape roadmap</td>
                          </tr>
                          <tr>
                            <td style="padding:4px 0;color:#c8c8d8;font-size:13px;">✓ &nbsp;The 3 financial systems to build first</td>
                          </tr>
                          <tr>
                            <td style="padding:4px 0;color:#c8c8d8;font-size:13px;">✓ &nbsp;Robert's personal framework for breaking the cycle</td>
                          </tr>
                        </table>
                        <a href="https://buy.stripe.com/9B6dRad5653g7d77028Vi0b"
                           style="display:inline-block;background-color:#c9973a;color:#1a1a2e;text-decoration:none;padding:14px 36px;border-radius:6px;font-weight:bold;font-size:16px;margin-top:8px;">
                          Get the Full Blueprint — $47
                        </a>
                      </td>
                    </tr>

                    <!-- $499 Strategy Session Offer -->
                    <tr>
                      <td style="padding:36px 40px;background-color:#ffffff;text-align:center;border-top:2px solid #c9973a;">
                        <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Premium Option</p>
                        <h2 style="color:#1a1a2e;font-family:Georgia,serif;font-size:20px;margin:0 0 12px;">
                          Work Directly With Robert
                        </h2>
                        <p style="color:#7a7a8a;font-size:14px;margin:0 0 8px;line-height:1.7;">
                          Robert Brickey is a licensed financial advisor with Prudential. The $499 Strategy Session isn't generic coaching — it's a real, personalized financial plan built around your life, your numbers, and your goals.
                        </p>
                        <p style="color:#7a7a8a;font-size:14px;margin:0 0 20px;line-height:1.7;">
                          If you're ready to stop guessing and start building — this is the session that changes everything.
                        </p>
                        <a href="https://buy.stripe.com/7sY14o7KMbrE693ckm8Vi0c"
                           style="display:inline-block;background-color:#ffffff;color:#c9973a;border:2px solid #c9973a;text-decoration:none;padding:12px 32px;border-radius:6px;font-weight:bold;font-size:15px;">
                          Book Your Strategy Session — $499
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
