import { createClient } from "@supabase/supabase-js";
 
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
 
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const STRIPE_47 = "https://buy.stripe.com/9B6dRad5653g7d77028Vi0b";
const STRIPE_499 = "https://buy.stripe.com/7sY14o7KMbrE693ckm8Vi0c";
const CALENDLY = "https://calendly.com/exit-etfm/etfm-strategic-reset-session";
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
      from: "ETFM <noreply@etfm.systems>",
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
</head>
<body style="margin:0;padding:0;background-color:#f7f4ef;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f4ef;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e3da;">
        <tr>
          <td style="background-color:#1a1a2e;padding:32px 40px;text-align:center;">
            <img src="${LOGO}" alt="ETFM" width="100" style="display:block;margin:0 auto 16px;"/>
            <p style="margin:0;color:#c9973a;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Georgia,serif;">Escape The Financial Matrix</p>
          </td>
        </tr>
        ${content}
        <tr>
          <td style="background-color:#f7f4ef;padding:24px 40px;text-align:center;border-top:1px solid #e8e3da;">
            <p style="margin:0 0 8px;color:#7a7a8a;font-size:12px;">Questions? <a href="mailto:info@etfm.systems" style="color:#c9973a;">info@etfm.systems</a></p>
            <p style="margin:0;color:#a0a0a8;font-size:11px;font-style:italic;">ETFM provides educational and strategic financial guidance designed to support clarity, structure, and decision-making. This does not constitute individualized investment, legal, or tax advice.</p>
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
function calculateAwarenessScore(answers) {
  const scoreMap = {
    // Q1 — Financial Awareness
    "no_idea": 10, "some_inconsistent": 30, "track_mentally": 50, "track_most": 70, "know_exactly": 90,
    // Q2 — Extra Money Pattern
    "disappears_bills": 10, "spend_quickly": 20, "try_save": 40, "use_intentionally": 70, "save_invest": 90,
    // Q3 — Stress Response
    "avoid": 10, "emotional_decisions": 20, "work_more": 40, "ask_others": 50, "slow_plan": 85,
    // Q4 — Structural Weakness
    "debt": 30, "spending": 25, "saving": 35, "income_consistency": 40, "planning_future": 45, "investing": 50, "fairly_organized": 80,
    // Q5 — Future Vision
    "stability": 50, "peace_of_mind": 55, "freedom_from_debt": 60, "time_freedom": 65, "ownership_wealth": 75, "security_family": 70, "dont_know": 20,
  };
  const scores = answers.map((a) => scoreMap[a] || 40);
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
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
 
    let snapshotHtml = "";
    try {
      snapshotHtml = await callClaude(`You are Robert Brickey, a licensed financial advisor and creator of ETFM (Escape The Financial Matrix). You speak with calm authority — strategic, observational, never preachy or salesy.
 
${firstName}'s Financial Archetype: ${archetype}
${firstName}'s Awareness Score: ${awarenessScore}/100
 
Assessment answers:
${answersText}
 
Write their personalized ETFM Snapshot in HTML. Content sections only — no html/head/body tags. Use simple inline-styled HTML.
 
Follow this EXACT structure:
 
1. OPENING (2 sentences) — acknowledge what it means that they stopped and looked honestly. Warm but not sentimental.
 
2. FINANCIAL IDENTITY — display their archetype: "${archetype}" in bold gold. 2-3 sentences explaining exactly what this means for them based on their specific answers. Be precise — reference what they actually said.
 
3. AWARENESS SCORE — display: <h2 style="color:#c9973a;font-size:42px;font-family:Georgia,serif;margin:20px 0 4px;">${awarenessScore}/100</h2><p style="color:#7a7a8a;font-size:13px;margin:0 0 24px;">Awareness Score</p> Then 2 sentences interpreting what this score means right now.
 
4. KEY PATTERN OBSERVATION — 3 sentences. Name the specific financial cycle their answers reveal. This should feel like an advisor who has seen this pattern before and knows it well. Reference their actual answers.
 
5. THE AHA MOMENT — one single observation that makes them feel: "How did this know that?" Something deeply accurate about their specific situation that most people never name. This is the most important part.
 
6. ONE ACTION THIS WEEK — one concrete specific action. Not vague. Example: "Open a separate savings account today and name it Freedom Fund. Move $25 into it before Friday — not because $25 changes everything, but because the decision does."
 
7. CLOSING LINE — one powerful forward-momentum sentence.
 
Tone: calm, strategic, observational, intelligent. Never motivational. Never generic. Always specific.
Use: <h3>, <p>, <strong>, <hr style="border:none;border-top:1px solid #e8e3da;margin:28px 0;">
Keep under 500 words total.`);
    } catch (err) {
      console.error("Claude snapshot error:", err);
      snapshotHtml = `<p>Hi ${firstName},</p><p>Your ETFM Financial Snapshot has been prepared. Your Awareness Score is <strong>${awarenessScore}/100</strong> and your financial archetype is <strong>${archetype}</strong>. A follow-up from Robert will provide your full analysis.</p>`;
    }
 
    const emailHtml = emailWrapper(`
      <tr><td style="padding:40px;color:#1a1a2e;font-size:15px;line-height:1.8;">
        ${snapshotHtml}
      </td></tr>
      <tr><td style="padding:0 40px 40px;">
        <hr style="border:none;border-top:2px solid #e8e3da;margin:0 0 32px;"/>
      </td></tr>
      <tr>
        <td style="padding:0 40px 40px;background-color:#1a1a2e;text-align:center;">
          <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:32px 0 12px;">Want to go deeper?</p>
          <h2 style="color:#ffffff;font-family:Georgia,serif;font-size:22px;margin:0 0 16px;line-height:1.4;">Unlock Your Strategic Financial Blueprint</h2>
          <p style="color:#a0a0b8;font-size:14px;margin:0 0 20px;line-height:1.7;">Your Snapshot shows where you are. The Blueprint diagnoses exactly why — with 18 questions that go into your real numbers, patterns, and structure. Then delivers a personalized escape roadmap, the 5-step ETFM framework PDF, Robert's video message, and your 30-Day Strategic Reset Protocol.</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
            <tr><td style="padding:4px 0;color:#c8c8d8;font-size:13px;">✓ &nbsp;18-question strategic diagnostic</td></tr>
            <tr><td style="padding:4px 0;color:#c8c8d8;font-size:13px;">✓ &nbsp;Personalized escape roadmap</td></tr>
            <tr><td style="padding:4px 0;color:#c8c8d8;font-size:13px;">✓ &nbsp;5-Step ETFM Framework PDF</td></tr>
            <tr><td style="padding:4px 0;color:#c8c8d8;font-size:13px;">✓ &nbsp;Robert's personal video message</td></tr>
            <tr><td style="padding:4px 0;color:#c8c8d8;font-size:13px;">✓ &nbsp;30-Day Strategic Reset Protocol</td></tr>
          </table>
          <a href="${STRIPE_47}" style="display:inline-block;background-color:#c9973a;color:#1a1a2e;text-decoration:none;padding:14px 36px;border-radius:6px;font-weight:bold;font-size:16px;">Get the Strategic Blueprint — $47</a>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 40px;background-color:#ffffff;text-align:center;border-top:2px solid #c9973a;">
          <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Premium</p>
          <h3 style="color:#1a1a2e;font-family:Georgia,serif;font-size:18px;margin:0 0 10px;">Work Directly With Robert</h3>
          <p style="color:#7a7a8a;font-size:14px;margin:0 0 16px;line-height:1.7;">Robert is a licensed financial advisor. The $499 Strategic Reset Session isn't coaching — it's a real, personalized financial plan built around your life, your numbers, and your goals.</p>
          <a href="${STRIPE_499}" style="display:inline-block;background-color:#ffffff;color:#c9973a;border:2px solid #c9973a;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:bold;font-size:14px;">Book Your Session — $499</a>
        </td>
      </tr>
    `);
 
    try {
      await sendEmail(email, `${firstName}, your ETFM Financial Snapshot is here`, emailHtml);
    } catch (err) {
      console.error("Email send error:", err);
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
      reportHtml = await callClaude(`You are Robert Brickey, a licensed financial advisor and creator of ETFM. You are writing a private Strategic Financial Blueprint — a premium advisor-grade document, not an AI report.
 
CLIENT: ${firstName}
ALL ASSESSMENT DATA:
${allAnswersText}
 
Write the Strategic Financial Blueprint in HTML. This document follows a FIXED ARCHITECTURE — you personalize the language within each section based on their specific answers.
 
FIXED REPORT STRUCTURE — follow exactly:
 
1. OPENING OBSERVATION
One paragraph. Observational, calm, precise. Name something specific about their financial situation that most people never articulate clearly. This should feel like an advisor who has studied their file.
 
2. PATTERN DIAGNOSIS
What is the specific financial pattern their answers reveal? Name the cycle. Be precise. 2-3 sentences that make them feel deeply understood.
 
3. STRUCTURAL WEAKNESS ANALYSIS
Based on their answers about money organization, automation, emergency fund, and debt — what is the primary structural gap? What is it costing them? 2-3 sentences.
 
4. SYSTEM FRICTION POINTS
What are the 2-3 specific areas where their financial system is breaking down? Reference their actual answers about income predictability, financial pressure areas, and stress responses.
 
5. OWNERSHIP POSITIONING
Based on what they're currently building (or not building) — where are they on the spectrum from survival to ownership? What does this mean for their trajectory? 2-3 sentences.
 
6. FUTURE TRAJECTORY
If nothing changes, where does their current pattern lead in 5 years? Be honest but not harsh. Reference their answer about how they'd feel if nothing changed.
 
7. IMMEDIATE PRIORITIES — THE FIRST 3 MOVES
List exactly 3 specific actions they should take first. Not general advice — specific, sequenced, actionable. Format as a numbered list.
 
8. 30-DAY STRATEGIC RESET PROTOCOL
This is a critical deliverable. Provide a structured 30-day framework:
- Week 1: Visibility (what to see and measure)
- Week 2: Stabilization (first systems to put in place)
- Week 3: Structure (first automations and protections)
- Week 4: Momentum (first ownership moves)
Keep each week to 2-3 specific actions.
 
9. STRATEGIC RECOMMENDATION
One clear paragraph. Based on everything — what is the most important strategic move for ${firstName} right now? Be direct. This is the advisor speaking plainly.
 
10. LEVEL 3 TRANSITION
Natural, not salesy. Acknowledge that what's been revealed is complex. Note that a real financial plan — built around their actual numbers, structure, and goals — is the logical next step. Mention Robert works with a limited number of clients each month on exactly this. Include the Calendly link styled as a button.
 
TONE RULES:
- Calm, strategic, observational
- Never motivational or emotional
- Never generic
- Always specific to their answers
- Feels like a private document, not an email
- Professional but human
 
HTML formatting: use <h3 style="color:#1a1a2e;font-family:Georgia,serif;">, <p>, <strong style="color:#c9973a;">, <ol>, <li>
Section dividers: <hr style="border:none;border-top:1px solid #e8e3da;margin:32px 0;">
Keep under 900 words.`, 3000);
    } catch (err) {
      console.error("Blueprint Claude error:", err);
      reportHtml = `<p>Hi ${firstName}, your Strategic Financial Blueprint is being finalized. Robert will follow up directly with your complete report.</p>`;
    }
 
    const emailHtml = emailWrapper(`
      <tr>
        <td style="padding:32px 40px 0;text-align:center;">
          <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin:0 0 8px;">Strategic Financial Blueprint</p>
          <h1 style="color:#1a1a2e;font-family:Georgia,serif;font-size:26px;margin:0 0 8px;">Your Private Strategic Report</h1>
          <p style="color:#7a7a8a;font-size:13px;margin:0;">Prepared for ${firstName} — ETFM Strategic Diagnostic</p>
        </td>
      </tr>
      <tr><td style="padding:40px;color:#1a1a2e;font-size:15px;line-height:1.8;">
        ${reportHtml}
      </td></tr>
      <tr>
        <td style="padding:32px 40px;background-color:#1a1a2e;text-align:center;">
          <p style="color:#c9973a;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Ready for a Real Plan?</p>
          <h2 style="color:#ffffff;font-family:Georgia,serif;font-size:20px;margin:0 0 12px;">Book Your Strategic Reset Session</h2>
          <p style="color:#a0a0b8;font-size:14px;margin:0 0 20px;line-height:1.7;">Robert works with a limited number of clients each month on a complete financial architecture — built around your actual numbers, structure, and goals. This is where implementation begins.</p>
          <a href="${CALENDLY}" style="display:inline-block;background-color:#c9973a;color:#1a1a2e;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:15px;">Book Your Session — $499</a>
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
