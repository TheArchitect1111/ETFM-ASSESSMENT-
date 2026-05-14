import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── GET: Check session status OR create session from email button ──────────
  if (req.method === "GET") {
    const { session_id, action, email, firstName } = req.query;

    // Create session from email button click then redirect to Stripe
    if (action === "create" && email) {
      const sessionId = `bp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      await supabase.from("blueprint_sessions").insert({
        session_id: sessionId,
        email,
        first_name: firstName || "",
        status: "pending_payment",
        free_answers: {},
      });

      try {
        const stripe = (await import("stripe")).default(process.env.STRIPE_SECRET_KEY);
        const checkoutSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: {
                name: "ETFM Strategic Financial Blueprint",
                description: "18-question deep diagnostic + personalized AI report + 5-step framework PDF + 30-Day Reset Protocol",
              },
              unit_amount: 4700,
            },
            quantity: 1,
          }],
          mode: "payment",
          success_url: `https://etfm-assessment.vercel.app/blueprint/continue?session=${sessionId}`,
          cancel_url: `https://etfm-assessment.vercel.app/blueprint/continue?session=${sessionId}&cancelled=true`,
          customer_email: email,
          metadata: { blueprint_session_id: sessionId },
        });

        return res.redirect(302, checkoutSession.url);
      } catch (err) {
        console.error("Stripe error:", err);
        return res.status(500).json({ error: "Failed to create checkout" });
      }
    }

    // Check if existing session is paid
    if (session_id) {
      const { data, error } = await supabase
        .from("blueprint_sessions")
        .select("status, email, first_name, free_answers")
        .eq("session_id", session_id)
        .single();

      if (error || !data) return res.status(404).json({ error: "Session not found" });
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: "Missing parameters" });
  }

  if (req.method !== "POST") return res.status(405).end();

  const { action, ...body } = req.body;

  // ── CREATE: Save answers and create session (in-app flow) ─────────────────
  if (action === "create") {
    const { email, firstName, freeAnswers } = body;
    const sessionId = `bp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const { error } = await supabase.from("blueprint_sessions").insert({
      session_id: sessionId,
      email,
      first_name: firstName,
      status: "pending_payment",
      free_answers: freeAnswers,
    });

    if (error) {
      console.error("Session create error:", error);
      return res.status(500).json({ error: "Failed to create session" });
    }

    try {
      const stripe = (await import("stripe")).default(process.env.STRIPE_SECRET_KEY);
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "ETFM Strategic Financial Blueprint",
              description: "18-question deep diagnostic + personalized AI report + 5-step framework PDF + Robert's video message + 30-Day Reset Protocol",
            },
            unit_amount: 4700,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `https://etfm-assessment.vercel.app/blueprint/continue?session=${sessionId}`,
        cancel_url: `https://etfm-assessment.vercel.app/blueprint/continue?session=${sessionId}&cancelled=true`,
        customer_email: email,
        metadata: { blueprint_session_id: sessionId },
      });

      return res.status(200).json({ checkoutUrl: checkoutSession.url, sessionId });
    } catch (err) {
      console.error("Stripe error:", err);
      return res.status(500).json({ error: "Failed to create checkout" });
    }
  }

  // ── COMPLETE: Save blueprint answers and trigger report ───────────────────
  if (action === "complete") {
    const { sessionId, blueprintAnswers } = body;

    const { data: session, error: fetchError } = await supabase
      .from("blueprint_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (fetchError || !session) return res.status(404).json({ error: "Session not found" });
    if (session.status !== "paid") return res.status(403).json({ error: "Payment required" });

    const { error: updateError } = await supabase
      .from("blueprint_sessions")
      .update({ blueprint_answers: blueprintAnswers })
      .eq("session_id", sessionId);

    if (updateError) return res.status(500).json({ error: "Failed to save answers" });

    fetch(`https://etfm-assessment.vercel.app/api/claude`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "blueprint_report",
        firstName: session.first_name,
        email: session.email,
        freeAnswers: session.free_answers,
        blueprintAnswers,
      }),
    }).catch(console.error);

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: "Invalid action" });
}
