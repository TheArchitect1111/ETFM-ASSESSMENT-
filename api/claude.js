import { createClient } from "@supabase/supabase-js";
const supabaseAnon = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const LOGO = "https://raw.githubusercontent.com/TheArchitect1111/ETFM-ASSESSMENT-/main/file_00000000e10471f5bb36fabf63d29869.png";
async function callClaude(prompt, maxTokens = 2048) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-opus-4-5", max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Claude error: ${JSON.stringify(data)}`);
  return data?.content?.[0]?.text || "";
}
function answerText(answers = [], index, fallback = "Not provided") { return answers[index]?.answer || answers[index] || fallback; }
function blueprintFallbackReport(firstName = "there", freeAnswers = [], blueprintAnswers = []) {
  const visibility = answerText(blueprintAnswers, 0);
  return `<h3>Executive Pattern Read</h3><p>${firstName}, your Blueprint needs clearer visibility and structure.</p><p>Visibility: ${visibility}</p>`;
}
function isUsableReport(html = "") { const text = html.replace(/<[^>]*>/g, " ").trim(); return text.length > 500; }
async function sendEmail(to, subject, html) {
  const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: "ETFM <noreply@send.etfm.systems>", to, subject, html }) });
  return res.json();
}
function emailWrapper(content) { return `<!DOCTYPE html><html><body><table width="600"><tr><td>${content}</td></tr></table></body></html>`; }
const SCORE_MAP_API = { no_idea:2, some_inconsistent:7, track_mentally:11, track_most:16, know_exactly:20, disappears_bills:2, spend_quickly:4, try_save:9, use_intentionally:16, save_invest:20, avoid:2, emotional_decisions:5, work_more:9, ask_others:12, slow_plan:20, debt:6, spending:6, saving:9, income_consistency:10, planning_future:11, investing:13, fairly_organized:20, stability:13, peace_of_mind:15, freedom_from_debt:16, time_freedom:17, ownership_wealth:20, security_family:19, dont_know:5 };
function calculateAwarenessScore(answers) { const scores = answers.map((a) => SCORE_MAP_API[a] || 10); return Math.min(100, scores.reduce((sum, s) => sum + s, 0)); }
function assignArchetype(answers, awarenessScore) {
  if (awarenessScore < 25) return "Financial Avoider"; if (awarenessScore < 40) return "Drifter";
  if (answers.includes("disappears_bills")) return "Leaker"; if (awarenessScore >= 70) return "Builder"; return "Directionless Earner";
}
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://etfm-assessment.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const ALLOWED = ["subscribe", "blueprint_report"];
  const { type: checkType } = req.body || {};
  if (!checkType || !ALLOWED.includes(checkType)) return res.status(400).json({ error: "Invalid type" });
  const { type, ...body } = req.body;
  if (type === "subscribe") {
    const { firstName, email, answers } = body;
    const answerValues = answers.map((a) => a.answer);
    const awarenessScore = calculateAwarenessScore(answerValues);
    const archetype = assignArchetype(answerValues, awarenessScore);
    return res.status(200).json({ success: true, awarenessScore, archetype });
  }
  if (type === "blueprint_report") {
    const { firstName, email, freeAnswers, blueprintAnswers } = body;
    const emailToCheck = (email || '').toLowerCase().trim();
    if (!emailToCheck) return res.status(401).json({ error: 'Email required' });
    try {
      const { data: ent, error: entError } = await supabaseAdmin.from('entitlement_ledger').select('id').eq('email', emailToCheck).eq('product','blueprint_report').eq('status','paid').limit(1).maybeSingle();
      if (entError) { console.error(`Entitlement check failed: ${entError.message}`); return res.status(500).json({ error: 'Entitlement check failed' }); }
      if (!ent) { console.log(`Paywall blocked: ${emailToCheck} has no paid entitlement`); return res.status(402).json({ error: 'Payment required', message: 'Purchase Blueprint at /pricing' }); }
    } catch (e) { console.error(`Entitlement exception: ${e.message}`); return res.status(500).json({ error: 'Server error' }); }
    let reportHtml = "";
    try { reportHtml = await callClaude(`Write Blueprint for ${firstName}`, 1500); } catch (err) { reportHtml = blueprintFallbackReport(firstName, freeAnswers, blueprintAnswers); }
    const emailHtml = emailWrapper(reportHtml);
    try { await sendEmail(email, `${firstName}, your Blueprint is ready`, emailHtml); } catch (err) {}
    return res.status(200).json({ success: true });
  }
  return res.status(400).json({ error: "Invalid request type" });
}
