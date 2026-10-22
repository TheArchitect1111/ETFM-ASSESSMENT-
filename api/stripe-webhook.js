import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'];
  const buf = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature failed: ${err.message}`);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Only care about successful checkouts
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, type: event.type });
  }

  const session = event.data.object;
  const email = (session.customer_details?.email || session.customer_email || '').toLowerCase().trim();
  const amount = session.amount_total || 0;
  
  // Map price to product - adjust these price IDs to yours
  let product = 'blueprint_report';
  if (session.metadata?.product) product = session.metadata.product;

  // Idempotency: event.id unique
  try {
    const { error } = await supabase.from('entitlement_ledger').insert({
      email,
      product,
      stripe_session_id: session.id,
      stripe_event_id: event.id,
      status: 'paid',
      amount_cents: amount,
      metadata: { livemode: event.livemode }
    });

    if (error) {
      if (error.code === '23505') {
        // Duplicate - already processed
        console.log(`Duplicate event ${event.id} ignored`);
        return res.status(200).json({ received: true, duplicate: true });
      }
      console.error(`Ledger insert failed: ${error.message}`);
      return res.status(500).json({ error: 'Ledger insert failed' });
    }

    console.log(`Entitlement granted: ${product} for event ${event.id}`);
    return res.status(200).json({ received: true, entitlement: product });

  } catch (e) {
    console.error(`Webhook error: ${e.message}`);
    return res.status(500).json({ error: 'Server error' });
  }
}
