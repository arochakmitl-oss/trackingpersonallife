const STRIPE_API = "https://api.stripe.com/v1/checkout/sessions";

function formEncode(values) {
  return new URLSearchParams(values).toString();
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    response.status(500).json({ error: "ยังไม่ได้ตั้งค่า STRIPE_SECRET_KEY บน Vercel" });
    return;
  }

  const origin = request.headers.origin || `https://${request.headers.host}`;
  const body = formEncode({
    mode: "subscription",
    "payment_method_types[0]": "card",
    "line_items[0][price_data][currency]": "thb",
    "line_items[0][price_data][product_data][name]": "Life tracker Unlimited Support",
    "line_items[0][price_data][unit_amount]": "3900",
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][quantity]": "1",
    success_url: `${origin}/?support=success`,
    cancel_url: `${origin}/?support=cancel`
  });

  try {
    const stripeResponse = await fetch(STRIPE_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    });
    const payload = await stripeResponse.json();
    if (!stripeResponse.ok) {
      response.status(stripeResponse.status).json({ error: payload.error?.message || "Stripe checkout failed" });
      return;
    }
    response.status(200).json({ url: payload.url });
  } catch {
    response.status(500).json({ error: "Stripe checkout failed" });
  }
};
