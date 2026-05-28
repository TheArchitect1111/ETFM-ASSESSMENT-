import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = "https://etfm-assessment.vercel.app";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, firstName } = req.body || {};

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "ETFM Reset Experience",
            description: "Guided implementation system and private client portal",
          },
          unit_amount: 9900,
        },
        quantity: 1,
      }],
      mode: "payment",
      ...(email ? { customer_email: email } : {}),
      success_url: `${BASE_URL}/portal?resetPaid=true`,
      cancel_url: `${BASE_URL}/?showReset=true`,
      metadata: {
        product: "reset_99",
        email: email || "",
        firstName: firstName || "",
      },
    });

    return res.status(200).json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("Reset checkout error:", err);
    return res.status(500).json({ error: err.message });
  }
}
