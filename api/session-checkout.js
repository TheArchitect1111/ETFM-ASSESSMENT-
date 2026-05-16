import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const PRICE_499 = "price_1TUD37JW514rdcAm2ZPOEZmG";
const PRICE_425 = "price_1TXaCcJW514rdcAmZYpFTQUh";

const BASE_URL = "https://etfm-assessment.vercel.app";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, firstName, hasBlueprint } = req.body;

  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    // Check Supabase to see if they have a paid blueprint session
    let isBlueprint = hasBlueprint;
    if (!isBlueprint) {
      const { data } = await supabase
        .from("blueprint_sessions")
        .select("status")
        .eq("email", email)
        .eq("status", "paid")
        .single();
      if (data) isBlueprint = true;
    }

    const priceId = isBlueprint ? PRICE_425 : PRICE_499;
    const amount  = isBlueprint ? 425 : 499;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      customer_email: email,
      success_url: `${BASE_URL}/?sessionPaid=true&email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName || "")}&hasBlueprint=${isBlueprint}`,
      cancel_url:  `${BASE_URL}/?showSession=true&email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName || "")}`,
      metadata: { email, firstName: firstName || "", hasBlueprint: String(isBlueprint), amount: String(amount) },
    });

    // Store booking intent in Supabase
    await supabase.from("calendly_bookings").insert({
      email,
      first_name: firstName || "",
      stripe_session_id: session.id,
      status: "pending_payment",
    });

    return res.status(200).json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("Session checkout error:", err);
    return res.status(500).json({ error: err.message });
  }
}
