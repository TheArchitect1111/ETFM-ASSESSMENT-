import { createClient } from "@supabase/supabase-js";
 
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
 
export const config = { api: { bodyParser: false } };
 
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
 
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
 
  const rawBody = await getRawBody(req);
  const sig = req.headers["stripe-signature"];
 
  let event;
  try {
    const stripe = (await import("stripe")).default(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
 
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const blueprintSessionId = session.metadata?.blueprint_session_id;
 
    if (blueprintSessionId) {
      const { error } = await supabase
        .from("blueprint_sessions")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("session_id", blueprintSessionId);
 
      if (error) {
        console.error("Supabase update error:", error);
        return res.status(500).json({ error: "DB update failed" });
      }
 
      console.log(`Session ${blueprintSessionId} marked as paid`);
    }
  }
 
  return res.status(200).json({ received: true });
}
