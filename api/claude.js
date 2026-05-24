import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY

);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const STRIPE_47 = "https://buy.stripe.com/bJe7sM5CE9jwbtnace8Vi0d";
const CALENDLY = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";
const FRAMEWORK_URL = "https://etfm-assessment.vercel.app/framework.html";
const LOGO = "https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/file_00000000e10471f5bb36fabf63d29869.png";

async function callClaude(prompt, maxTokens = 2048) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data?.content?.[0]?.text || "";
}

async function sendEmail(to, subject, html) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ETFM <noreply@send.etfm.systems>",
      to,
      subject,
      html,
    }),
  });
  const data = await res.json();
  if (!res.ok) console.error("Resend error:", data);
  return data;
}

function emailWrapper(content) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    @media only screen and (max-width:600px){
      .email-outer{padding:8px 0!important;}
      .email-table{width:100%!important;border-radius:0!important;}
      .email-pad{padding:24px 20px!important;}
      .email-hero{padding:24px 20px!important;}
      .email-body{padding:24px 20px!important;}
      .offer-dark{padding:24px 20px!important;}
      .offer-light{padding:24px 20px!important;}
      .score-text{font-size:32px!important;}
      .cta-btn{padding:14px 20px!important;font-size:15px!important;display:block!important;text-align:center!important;box-sizing:border-box!important;}
      .checklist-td{font-size:13px!important;}
      h1,h2,h3{font-size:18px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f7f4ef;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" class="email-outer" style="background-color:#f7f4ef;padding:40px 0;">
    <tr><td align="center">
      <table class="email-table" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e3da;">
        <tr>
          <td class="email-hero" style="background-color:#1a1a2e;padding:32px 40px;text-align:center;">
            <img src="${LOGO}" alt="ETFM" width="80" style="display:block;margin:0 auto 16px;max-width:80px;"/>
            <p style="margin:0;color:#c9973a;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Georgia,serif;">Escape The Financial Matrix</p>
          </td>
        </tr>
        ${content}
        <tr>
          <td class="email-pad" style="background-color:#f7f4ef;padding:24px 40px;text-align:center;border-top:1px solid #e8e3da;">
            <p style="margin:0 0 8px;color:#7a7a8a;font-size:12px;">Questions? <a href="mailto:exit@etfm.systems" style="color:#c9973a;">exit@etfm.systems</a></p>
            <p style="margin:0;color:#a0a0a8;font-size:11px;font-style:italic;line-height:1.6;">ETFM provides educational and strategic financial guidance designed to support clarity, structure, and decision-making. This does not constitute individualized investment, legal, or tax advice.</p>
            <p style="margin:8px 0 0;color:#7a7a8a;font-size:11px;">© ${new Date().getFullYear()} Escape The Financial Matrix. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── SCORING ENGINE ────────────────────────────────────────────────────────────
const SCORE_MAP_API = {
  no_idea:2, some_inconsistent:7, track_mentally:11, track_most:16, know_exactly:20,
  disappears_bills:2, spend_quickly:4, try_save:9, use_intentionally:16, save_invest:20,
  avoid:2, emotional_decisions:5, work_more:9, ask_others:12, slow_plan:20,
  debt:6, spending:6, saving:9, income_consistency:10, planning_future:11, investing:13, fairly_organized:20,
  stability:13, peace_of_mind:15, freedom_from_debt:16, time_freedom:17, ownership_wealth:20, security_family:19, dont_know:5,
};

const SCORE_CATEGORIES = ["Awareness", "Money Pattern", "Stress Response", "Financial Structure", "System Readiness"];

function calculateAwarenessScore(answers) {
  const scores = answers.map((a) => SCORE_MAP_API[a] || 10);
  return Math.min(100, scores.reduce((sum, s) => sum + s, 0));
}

function assignArchetype(answers, awarenessScore) {
  if (awarenessScore < 25) return "Financial Avoider";
  if (awarenessScore < 40) return "Drifter";
  if (answers.includes("disappears_bills") || answers.includes("spend_quickly")) return "Leaker";
  if (answers.includes("work_more") && awarenessScore < 60) return "Overextended Achiever";
  if (answers.includes("dont_know")) return "Directionless Earner";
  if (answers.includes("try_save") && awarenessScore < 60) return "Stuck Saver";
  if (awarenessScore >= 70) return "Builder";
  return "Directionless Earner";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { type, ...body } = req.body;

  // ── LEVEL 1: Free Snapshot Email ──────────────────────────────────────────
  if (type === "subscribe") {
    const { firstName, email, answers } = body;

    const answerValues = answers.map((a) => a.answer);
    const awarenessScore = calculateAwarenessScore(answerValues);
    const archetype = assignArchetype(answerValues, awarenessScore);

    const answersText = answers
      .map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`)
      .join("\n\n");

    const componentScores = answerValues.map((v) => SCORE_MAP_API[v] || 40);
    const scoreTableHtml = `
      <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 28px;border-collapse:collapse;background:#1a1a2e;border-radius:10px;overflow:hidden;">
        <tr><td colspan="2" style="padding:18px 20px 10px;text-align:center;"><p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0;">Your Awareness Score Breakdown</p></td></tr>
        <tr style="background:rgba(201,151,58,0.15);border-bottom:2px solid rgba(201,151,58,0.4);">
          <td style="padding:12px 20px;color:#ffffff;font-size:15px;font-weight:bold;">Total Awareness Score</td>
          <td style="padding:12px 20px;color:#c9973a;font-size:24px;font-family:Georgia,serif;font-weight:bold;text-align:right;">${awarenessScore}/100</td>
        </tr>
        ${SCORE_CATEGORIES.map((cat, i) => `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
          <td style="padding:9px 20px;color:#a0a0b8;font-size:13px;">${cat}</td>
          <td style="padding:9px 20px;color:#c9973a;font-size:16px;font-weight:bold;text-align:right;">${componentScores[i]}</td>
        </tr>`).join('')}
      </table>`;

    let snapshotHtml = "";
    try {
      snapshotHtml = await callClaude(`You are Robert Brickey, a licensed financial strategist and creator of ETFM (Escape The Financial Matrix). You speak with calm authority, strategic, observational, never preachy or salesy.

${firstName}'s Financial Archetype: ${archetype}
${firstName}'s Awareness Score: ${awarenessScore}/100

Assessment answers:
${answersText}

Write their personalized ETFM Snapshot in HTML. Content sections only, no html/head/body tags. Use simple inline-styled HTML.

Follow this EXACT structure:

1. OPENING (2 sentences), acknowledge what it means that they stopped and looked honestly. Warm but not sentimental.

2. FINANCIAL IDENTITY, display their archetype: "${archetype}" in bold gold. 2-3 sentences explaining exactly what this means for them based on their specific answers. Be precise, reference what they actually said.

3. AWARENESS SCORE, display: <h2 style="color:#c9973a;font-size:42px;font-family:Georgia,serif;margin:20px 0 4px;">${awarenessScore}/100</h2><p style="color:#7a7a8a;font-size:13px;margin:0 0 24px;">Total Awareness Score</p> Then 2 sentences interpreting what this score means right now.

4. KEY PATTERN OBSERVATION, 3 sentences. Name the specific financial cycle their answers reveal. This should feel like an advisor who has seen this pattern before and knows it well. Reference their actual answers.

5. THE AHA MOMENT, one single observation that makes them feel: "How did this know that?" Something deeply accurate about their specific situation that most people never name. This is the most important part.

6. ONE ACTION THIS WEEK, one concrete specific action. Not vague. Example: "Open a separate savings account today and name it Freedom Fund. Move $25 into it before Friday, not because $25 changes everything, but because the decision does."

7. CLOSING LINE, one powerful forward-momentum sentence.

Tone: calm, strategic, observational, intelligent. Never motivational. Never generic. Always specific.
Use: <h3>, <p>, <strong>, <hr style="border:none;border-top:1px solid #e8e3da;margin:28px 0;">
Keep under 250 words total.`, 1024);
    } catch (err) {
      console.error("Claude snapshot error:", err);
      snapshotHtml = `<p>Hi ${firstName},</p><p>Your ETFM Financial Snapshot has been prepared. Your Awareness Score is <strong>${awarenessScore}/100</strong> and your financial archetype is <strong>${archetype}</strong>. A follow-up from Robert will provide your full analysis.</p>`;
    }

    const emailHtml = emailWrapper(`
      <tr>
        <td class="email-body" style="padding:40px;color:#1a1a2e;font-size:15px;line-height:1.8;">
          <p style="color:#1a1a2e;font-family:Georgia,serif;font-size:22px;font-weight:normal;margin:0 0 16px;line-height:1.4;">Congratulations, ${firstName}.</p>
          <p style="color:#4a4a4a;font-size:15px;line-height:1.9;margin:0 0 12px;">You have taken the first step most people avoid: slowing down long enough to see your financial patterns clearly.</p>
          <p style="color:#4a4a4a;font-size:15px;line-height:1.9;margin:0 0 24px;">Your ETFM Awareness Score below is a guided snapshot of how your current habits, structure, stress responses, and financial visibility are working together to shape your financial life today. It is scored across five behavioral components based on your answers. This is not a judgment. It is a starting point. And awareness is where real change begins.</p>
          ${scoreTableHtml}
          ${snapshotHtml}
        </td>
      </tr>
      <tr>
        <td style="padding:0 40px 40px;">
          <hr style="border:none;border-top:2px solid #e8e3da;margin:0 0 32px;"/>
        </td>
      </tr>
      <tr>
        <td class="offer-dark" style="padding:32px 40px 40px;background-color:#1a1a2e;text-align:center;">
          <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Want to go deeper?</p>
          <h2 style="color:#ffffff;font-family:Georgia,serif;font-size:22px;margin:0 0 16px;line-height:1.4;">Unlock Your Strategic Financial Blueprint</h2>
          <p style="color:#a0a0b8;font-size:14px;margin:0 0 20px;line-height:1.7;">Your Snapshot shows where you are. The Blueprint diagnoses exactly why, with 18 questions that go into your real numbers, patterns, and structure. Then delivers a personalized escape roadmap, the 5-step ETFM framework PDF, Robert's video message, and your 30-Day Strategic Reset Protocol.</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;text-align:left;">
            <tr><td class="checklist-td" style="padding:5px 0;color:#c8c8d8;font-size:14px;line-height:1.6;">✓ &nbsp;18-question strategic diagnostic</td></tr>
            <tr><td class="checklist-td" style="padding:5px 0;color:#c8c8d8;font-size:14px;line-height:1.6;">✓ &nbsp;Personalized escape roadmap</td></tr>
            <tr><td class="checklist-td" style="padding:5px 0;color:#c8c8d8;font-size:14px;line-height:1.6;">✓ &nbsp;5-Step ETFM Framework PDF</td></tr>
            <tr><td class="checklist-td" style="padding:5px 0;color:#c8c8d8;font-size:14px;line-height:1.6;">✓ &nbsp;Robert's personal video message</td></tr>
            <tr><td class="checklist-td" style="padding:5px 0;color:#c8c8d8;font-size:14px;line-height:1.6;">✓ &nbsp;30-Day Strategic Reset Protocol</td></tr>
          </table>
          <a href="https://etfm-assessment.vercel.app/?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&showBlueprint=true" class="cta-btn" style="display:inline-block;background-color:#c9973a;color:#1a1a2e;text-decoration:none;padding:14px 36px;border-radius:6px;font-weight:bold;font-size:16px;">Get the Strategic Blueprint: $47</a>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 40px;background-color:#f7f4ef;border-top:2px solid #e8e3da;text-align:center;">
          <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Step 3</p>
          <h3 style="color:#1a1a2e;font-family:Georgia,serif;font-size:20px;margin:0 0 12px;text-align:center;line-height:1.4;">Build the Systems That Create Stability</h3>
          <p style="color:#7a7a8a;font-size:14px;margin:0 0 20px;line-height:1.7;text-align:left;">The ETFM Reset Experience is a guided implementation system designed to help you reduce financial chaos, organize your financial life, and create more consistency, visibility, and control through practical weekly structure. Inside the Reset Experience you will build the operational foundation that most people never create.</p>
          <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;text-align:left;">
            <tr><td style="padding:8px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #e8e3da;"><strong>Financial Reset Workbook</strong><br/><span style="color:#7a7a8a;">A structured workbook to map your current financial reality, clarify your numbers, and begin building your system from the ground up.</span></td></tr>
            <tr><td style="padding:8px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #e8e3da;"><strong>Financial Reality Audit</strong><br/><span style="color:#7a7a8a;">A guided audit to surface every income stream, expense, debt, and pattern so nothing stays hidden or unaccounted for.</span></td></tr>
            <tr><td style="padding:8px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #e8e3da;"><strong>Bill Organization System</strong><br/><span style="color:#7a7a8a;">A clear system to organize, schedule, and manage every recurring bill and obligation without stress or missed payments.</span></td></tr>
            <tr><td style="padding:8px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #e8e3da;"><strong>Financial Calendar and Visibility System</strong><br/><span style="color:#7a7a8a;">A visual calendar framework that puts every financial deadline, payment, and priority in one place so you always know what is coming.</span></td></tr>
            <tr><td style="padding:8px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #e8e3da;"><strong>Spending Pattern Analysis</strong><br/><span style="color:#7a7a8a;">A deep-dive tool to identify where money is leaking, what habits are costing you, and where to redirect with intention.</span></td></tr>
            <tr><td style="padding:8px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #e8e3da;"><strong>Weekly System Review Framework</strong><br/><span style="color:#7a7a8a;">A simple weekly review process to keep your finances on track, adjust in real time, and build the habit of consistent oversight.</span></td></tr>
            <tr><td style="padding:8px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #e8e3da;"><strong>Guided Five-Phase Reset Journey</strong><br/><span style="color:#7a7a8a;">A structured five-phase process that walks you step by step from financial chaos to clarity, structure, and momentum.</span></td></tr>
            <tr><td style="padding:8px 0;color:#1a1a2e;font-size:13px;line-height:1.6;"><strong>Strategic Guidance from Robert Brickey</strong><br/><span style="color:#7a7a8a;">Direct strategic input from Robert, a licensed financial advisor and creator of ETFM, built into the reset experience.</span></td></tr>
          </table>
          <div style="text-align:center;">
            <a href="https://etfm-assessment.vercel.app/?showReset=true" class="cta-btn" style="display:inline-block;background-color:#1a1a2e;color:#c9973a;border:2px solid #1a1a2e;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;">Begin Your Reset Experience: $99</a>
          </div>
        </td>
      </tr>
      <tr>
        <td class="offer-light" style="padding:32px 40px;background-color:#ffffff;border-top:2px solid #c9973a;">
          <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;text-align:center;">Step 4</p>
          <h3 style="color:#1a1a2e;font-family:Georgia,serif;font-size:20px;margin:0 0 12px;text-align:center;line-height:1.4;">Strategic Reset Partnership</h3>
          <p style="color:#7a7a8a;font-size:14px;margin:0 0 20px;line-height:1.7;">Your Blueprint identified the pattern. Now it's time to build the structure. Work directly with Robert Brickey to analyze your current financial reality, close the structural gaps, and build a system that runs on intention, not pressure.</p>
          <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;">
            <tr><td class="checklist-td" style="padding:6px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #f0ece4;">✓ &nbsp;<strong>Pre-Session Financial Intake & Discovery Review</strong>, detailed review of your snapshot, goals, income flow, and current structure before the session begins</td></tr>
            <tr><td class="checklist-td" style="padding:6px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #f0ece4;">✓ &nbsp;<strong>60-Minute Private Strategic Reset Session</strong> with Robert Brickey, Licensed Financial Advisor & Creator of ETFM</td></tr>
            <tr><td class="checklist-td" style="padding:6px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #f0ece4;">✓ &nbsp;<strong>Personalized Financial Plan & Strategic Framework</strong>, built around your current reality, priorities, pressure points, and long-term goals</td></tr>
            <tr><td class="checklist-td" style="padding:6px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #f0ece4;">✓ &nbsp;<strong>Full Matrix Score & Structural Analysis</strong>, identify the financial behaviors, structural gaps, and decision-making patterns impacting your progress</td></tr>
            <tr><td class="checklist-td" style="padding:6px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #f0ece4;">✓ &nbsp;<strong>Decision Rules & Financial Policy System</strong>, develop clear rules for spending, saving, debt, and investing so pressure stops controlling your choices</td></tr>
            <tr><td class="checklist-td" style="padding:6px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #f0ece4;">✓ &nbsp;<strong>Custom 90-Day Strategic Reset Roadmap</strong>, a practical implementation plan with prioritized action steps and strategic focus areas</td></tr>
            <tr><td class="checklist-td" style="padding:6px 0;color:#1a1a2e;font-size:13px;line-height:1.6;border-bottom:1px solid #f0ece4;">✓ &nbsp;<strong>Session Recording</strong>, review your session anytime for clarity and reinforcement</td></tr>
            <tr><td class="checklist-td" style="padding:6px 0;color:#1a1a2e;font-size:13px;line-height:1.6;">✓ &nbsp;<strong>30 Days of Priority Email Support</strong>, ongoing clarification, guidance, and accountability during implementation</td></tr>
          </table>
          <p style="color:#7a7a8a;font-size:12px;font-style:italic;margin:0 0 20px;text-align:center;">This is not coaching. This is private strategic partnership.</p>
          <div style="text-align:center;">
<a href="https://etfm-assessment.vercel.app/?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&showSession=true" class="cta-btn" style="display:inline-block;background-color:#ffffff;color:#c9973a;border:2px solid #c9973a;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;">Book Your Strategic Reset Session: $499 →</a>
        </td>
      </tr>
    `);

    try {
      await sendEmail(email, `${firstName}, your ETFM Financial Snapshot is here`, emailHtml);
    } catch (err) {
      console.error("Email send error:", err);
    }

    // ── Admin Notification ────────────────────────────────────────────────────
    try {
      const adminHtml = emailWrapper(`
        <tr>
          <td class="email-body" style="padding:32px 40px;">
            <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">New Assessment Completed</p>
            <h2 style="color:#1a1a2e;font-family:Georgia,serif;font-size:22px;margin:0 0 24px;">New Lead, ETFM Snapshot</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #e8e3da;">
                <td style="padding:10px 0;font-size:13px;color:#7a7a8a;width:140px;">Name</td>
                <td style="padding:10px 0;font-size:14px;color:#1a1a2e;font-weight:500;">${firstName}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e3da;">
                <td style="padding:10px 0;font-size:13px;color:#7a7a8a;">Email</td>
                <td style="padding:10px 0;font-size:14px;color:#c9973a;">${email}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e3da;">
                <td style="padding:10px 0;font-size:13px;color:#7a7a8a;">Archetype</td>
                <td style="padding:10px 0;font-size:14px;color:#1a1a2e;font-weight:500;">${archetype}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e3da;">
                <td style="padding:10px 0;font-size:13px;color:#7a7a8a;">Awareness Score</td>
                <td style="padding:10px 0;font-size:24px;color:#c9973a;font-family:Georgia,serif;font-weight:bold;">${awarenessScore}/100</td>
              </tr>
            </table>
            <p style="margin:24px 0 8px;font-size:13px;color:#7a7a8a;text-transform:uppercase;letter-spacing:1px;">Assessment Answers</p>
            ${answers.map((a, i) => `
              <div style="padding:10px 0;border-bottom:1px solid #e8e3da;">
                <p style="font-size:12px;color:#7a7a8a;margin:0 0 4px;">Q${i+1}: ${a.question}</p>
                <p style="font-size:13px;color:#1a1a2e;margin:0;font-weight:500;">${a.answer}</p>
              </div>
            `).join("")}
            <div style="margin-top:28px;text-align:center;">
              <a href="mailto:${email}" style="display:inline-block;background-color:#c9973a;color:#1a1a2e;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:bold;font-size:14px;">Reply to ${firstName}</a>
            </div>
          </td>
        </tr>
      `);
      await sendEmail("exit@etfm.systems", `New Lead: ${firstName}: ${archetype} (${awarenessScore}/100)`, adminHtml);
    } catch (err) {
      console.error("Admin notification error:", err);
    }

    return res.status(200).json({ success: true, awarenessScore, archetype });
  }

  // ── LEVEL 2: Blueprint Deep Dive Report ───────────────────────────────────
  if (type === "blueprint_report") {
    const { firstName, email, freeAnswers, blueprintAnswers } = body;

    const allAnswersText = [
      "=== LEVEL 1 SNAPSHOT ANSWERS ===",
      ...Object.entries(freeAnswers || {}).map(([q, a]) => `${q}: ${a}`),
      "\n=== LEVEL 2 BLUEPRINT ANSWERS ===",
      ...blueprintAnswers.map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`),
    ].join("\n");

    let reportHtml = "";
    try {
      reportHtml = await callClaude(`You are Robert Brickey, a licensed financial strategist and creator of ETFM. You are writing a private Strategic Financial Blueprint, a premium strategic guidance document, not an AI report.

CLIENT: ${firstName}
ALL ASSESSMENT DATA:
${allAnswersText}

Write the Strategic Financial Blueprint in HTML. This document follows a FIXED ARCHITECTURE, you personalize the language within each section based on their specific answers.

FIXED REPORT STRUCTURE, follow exactly:

1. OPENING OBSERVATION
One paragraph. Observational, calm, precise. Name something specific about their financial situation that most people never articulate clearly. This should feel like an advisor who has studied their file.

2. PATTERN DIAGNOSIS
What is the specific financial pattern their answers reveal? Name the cycle. Be precise. 2-3 sentences that make them feel deeply understood.

3. STRUCTURAL WEAKNESS ANALYSIS
Based on their answers about money organization, automation, emergency fund, and debt, what is the primary structural gap? What is it costing them? 2-3 sentences.

4. SYSTEM FRICTION POINTS
What are the 2-3 specific areas where their financial system is breaking down? Reference their actual answers about income predictability, financial pressure areas, and stress responses.

5. OWNERSHIP POSITIONING
Based on what they're currently building (or not building), where are they on the spectrum from survival to ownership? What does this mean for their trajectory? 2-3 sentences.

6. FUTURE TRAJECTORY
If nothing changes, where does their current pattern lead in 5 years? Be honest but not harsh. Reference their answer about how they'd feel if nothing changed.

7. IMMEDIATE PRIORITIES, THE FIRST 3 MOVES
List exactly 3 specific actions they should take first. Not general advice, specific, sequenced, actionable. Format as a numbered list.

8. 30-DAY STRATEGIC RESET PROTOCOL
This is a critical deliverable. Provide a structured 30-day framework:
- Week 1: Visibility (what to see and measure)
- Week 2: Stabilization (first systems to put in place)
- Week 3: Structure (first automations and protections)
- Week 4: Momentum (first ownership moves)
Keep each week to 2-3 specific actions.

9. STRATEGIC RECOMMENDATION
One clear paragraph. Based on everything, what is the most important strategic move for ${firstName} right now? Be direct. This is the advisor speaking plainly.

10. LEVEL 3 TRANSITION
Natural, not salesy. Acknowledge that what's been revealed is complex. Note that a real financial roadmap, built around their actual numbers, structure, and goals, is the logical next step. Mention Robert works with a limited number of clients each month on exactly this. Include the Calendly link styled as a button.

TONE RULES:
- Calm, strategic, observational
- Never motivational or emotional
- Never generic
- Always specific to their answers
- Feels like a private document, not an email
- Professional but human

HTML formatting: use <h3 style="color:#1a1a2e;font-family:Georgia,serif;">, <p>, <strong style="color:#c9973a;">, <ol>, <li>
Section dividers: <hr style="border:none;border-top:1px solid #e8e3da;margin:32px 0;">
Keep under 900 words.`, 1500);
    } catch (err) {
      console.error("Blueprint Claude error:", err);
      reportHtml = `<p>Hi ${firstName}, your Strategic Financial Blueprint is being finalized. Robert will follow up directly with your complete report.</p>`;
    }

    const emailHtml = emailWrapper(`
      <tr>
        <td class="email-body" style="padding:32px 40px 0;text-align:center;">
          <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin:0 0 8px;">Strategic Financial Blueprint</p>
          <h1 style="color:#1a1a2e;font-family:Georgia,serif;font-size:26px;margin:0 0 8px;">Your Private Strategic Report</h1>
          <p style="color:#7a7a8a;font-size:13px;margin:0;">Prepared for ${firstName}, ETFM Strategic Diagnostic</p>
        </td>
      </tr>
      <tr>
        <td class="email-body" style="padding:40px;color:#1a1a2e;font-size:15px;line-height:1.8;">
          ${reportHtml}
        </td>
      </tr>
      <tr>
        <td class="offer-dark" style="padding:32px 40px;background-color:#1a1a2e;text-align:center;">
          <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Ready for a Real Plan?</p>
          <h2 style="color:#ffffff;font-family:Georgia,serif;font-size:20px;margin:0 0 12px;">Strategic Reset Partnership</h2>
          <p style="color:#a0a0b8;font-size:14px;margin:0 0 8px;line-height:1.7;">Your Blueprint identified the pattern. Now it's time to build the structure with Robert directly.</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 20px;text-align:left;">
            <tr><td class="checklist-td" style="padding:4px 0;color:#c8c8d8;font-size:13px;line-height:1.6;">✓ &nbsp;Pre-session financial intake & discovery review</td></tr>
            <tr><td class="checklist-td" style="padding:4px 0;color:#c8c8d8;font-size:13px;line-height:1.6;">✓ &nbsp;Two 30-minute calls with Robert Brickey</td></tr>
            <tr><td class="checklist-td" style="padding:4px 0;color:#c8c8d8;font-size:13px;line-height:1.6;">✓ &nbsp;Personalized financial roadmap & strategic framework</td></tr>
            <tr><td class="checklist-td" style="padding:4px 0;color:#c8c8d8;font-size:13px;line-height:1.6;">✓ &nbsp;Decision rules & financial policy system</td></tr>
            <tr><td class="checklist-td" style="padding:4px 0;color:#c8c8d8;font-size:13px;line-height:1.6;">✓ &nbsp;Custom 90-day strategic reset roadmap</td></tr>
            <tr><td class="checklist-td" style="padding:4px 0;color:#c8c8d8;font-size:13px;line-height:1.6;">✓ &nbsp;Session recording</td></tr>
            <tr><td class="checklist-td" style="padding:4px 0;color:#c8c8d8;font-size:13px;line-height:1.6;">✓ &nbsp;30 days of priority email support</td></tr>
          </table>
          <p style="color:#a0a0b8;font-size:13px;font-style:italic;margin:0 0 20px;">Your 5-Step ETFM Framework guide is also ready to view:</p>
          <a href="${FRAMEWORK_URL}" class="cta-btn" style="display:inline-block;background-color:rgba(201,151,58,0.15);color:#c9973a;border:1px solid #c9973a;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:14px;margin-bottom:20px;">View Your Framework Guide →</a>
          <br/>
<a href="https://etfm-assessment.vercel.app/?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&showSession=true&hasBlueprint=true" class="cta-btn" style="display:inline-block;background-color:#c9973a;color:#1a1a2e;text-decoration:none;padding:14px 36px;border-radius:6px;font-weight:bold;font-size:16px;">Book Your Strategic Reset Session: $499 →</a>
        </td>
      </tr>
    `);

    try {
      await sendEmail(email, `${firstName}, your ETFM Strategic Blueprint is ready`, emailHtml);
      console.log(`Blueprint report sent to ${email}`);
    } catch (err) {
      console.error("Blueprint email error:", err);
    }

    return res.status(200).json({ success: true });
  }

  // ── Direct Claude passthrough ─────────────────────────────────────────────
  try {
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
