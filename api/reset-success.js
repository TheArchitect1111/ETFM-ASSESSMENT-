import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = "https://etfm-assessment.vercel.app";
const RESET_PORTAL_URL = `${BASE_URL}/portal`;
const RESET_WELCOME_SUBJECT = "Your ETFM Reset Experience is ready";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAKE_RESET_WEBHOOK_URL = process.env.MAKE_RESET_WEBHOOK_URL;

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY || !to) return { skipped: true };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ETFM <exit@send.etfm.systems>",
      to,
      subject,
      html,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend error: ${JSON.stringify(data)}`);
  return data;
}

function resetWelcomeHtml(firstName = "") {
  const greeting = firstName ? `${firstName}, your Reset Experience is ready.` : "Your Reset Experience is ready.";

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:Arial,sans-serif;color:#1a1a2e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f7f4ef;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e8e3da;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#1a1a2e;padding:34px 40px;text-align:center;">
          <p style="margin:0 0 8px;color:#c9973a;font-family:Georgia,serif;font-size:34px;letter-spacing:8px;font-weight:bold;">ETFM</p>
          <p style="margin:0;color:#c8c8d8;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Escape The Financial Matrix</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:normal;margin:0 0 16px;">${greeting}</h1>
          <p style="font-size:15px;line-height:1.8;color:#4a4a4a;">Congratulations. Your ETFM Reset purchase is confirmed, and your private portal is ready.</p>
          <p style="font-size:15px;line-height:1.8;color:#4a4a4a;">Inside the portal, start with the opening instructions, then begin the Financial Reset Workbook. The goal is not to rush through everything. The goal is to create visibility, structure, and a weekly operating rhythm you can actually sustain.</p>
          <div style="background:#f7f4ef;border-left:3px solid #c9973a;padding:18px 20px;margin:28px 0;">
            <p style="margin:0 0 8px;color:#1a1a2e;font-weight:bold;font-size:14px;">What happens next</p>
            <p style="margin:0;color:#4a4a4a;font-size:14px;line-height:1.7;">Open your portal, read the welcome section, and complete Tool 01: Financial Reset Workbook first. That is where your Reset begins.</p>
          </div>
          <div style="text-align:center;margin:32px 0;">
            <a href="${RESET_PORTAL_URL}" style="display:inline-block;background:#c9973a;color:#1a1a2e;text-decoration:none;padding:14px 34px;border-radius:6px;font-weight:bold;">Open Your Reset Portal</a>
          </div>
          <p style="font-size:13px;line-height:1.7;color:#7a7a8a;">Questions? Reply to this email or contact exit@etfm.systems.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function resetWelcomeText(firstName = "") {
  const greeting = firstName ? `${firstName}, your Reset Experience is ready.` : "Your Reset Experience is ready.";

  return `${greeting}

Congratulations. Your ETFM Reset purchase is confirmed, and your private portal is ready.

What happens next:
1. Open your Reset portal.
2. Read the welcome section.
3. Complete Tool 01: Financial Reset Workbook first.

Portal: ${RESET_PORTAL_URL}

Questions? Reply to this email or contact exit@etfm.systems.`;
}

export default async function handler(req, res) {
  const checkoutSessionId = req.query.checkout_session_id;
  if (!checkoutSessionId) return res.redirect(302, `${BASE_URL}/?showReset=true&resetPaid=missing_session`);

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    const isReset = session.metadata?.product === "reset_99";
    const isPaid = session.payment_status === "paid";

    if (!isReset || !isPaid) {
      return res.redirect(302, `${BASE_URL}/?showReset=true&resetPaid=false`);
    }
  } catch (err) {
    console.error("Reset payment verification error:", err);
    return res.redirect(302, `${BASE_URL}/?showReset=true&resetPaid=verification_error`);
  }

  try {
    const metadata = session.metadata || {};
    const alreadySent = metadata.onboarding_sent === "true";

    if (!alreadySent) {
      const email = session.customer_details?.email || metadata.email;
      const firstName = metadata.firstName || "";
      const welcomeHtml = resetWelcomeHtml(firstName);
      const welcomeText = resetWelcomeText(firstName);

      await sendEmail(email, RESET_WELCOME_SUBJECT, welcomeHtml);

      if (MAKE_RESET_WEBHOOK_URL) {
        await fetch(MAKE_RESET_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: "reset_99",
            email,
            firstName,
            stripeSessionId: session.id,
            amountTotal: session.amount_total,
            paidAt: new Date().toISOString(),
            portalUrl: RESET_PORTAL_URL,
            resetWelcomeSubject: RESET_WELCOME_SUBJECT,
            resetWelcomeHtml: welcomeHtml,
            resetWelcomeText: welcomeText,
          }),
        }).catch((err) => console.error("Make Reset webhook error:", err));
      }

      await stripe.checkout.sessions.update(session.id, {
        metadata: { ...metadata, onboarding_sent: "true" },
      });
    }
  } catch (err) {
    console.error("Reset onboarding follow-up error:", err);
  }

  return res.redirect(302, `${BASE_URL}/?resetPaid=true`);
}
