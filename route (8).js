const Razorpay = require("razorpay");
const { requireOrg } = require("../../../../lib/apiAuth");
const { limitsFor } = require("../../../../lib/plans");

async function POST(req) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json(); // "PRO" | "ULTRA"
  const target = limitsFor(plan);
  if (!target || plan === "FREE") {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return Response.json(
      { error: "Razorpay is not configured yet. Add RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // Simple one-off order per billing cycle. For true recurring billing,
  // swap this for razorpay.subscriptions.create with a Plan ID created
  // in the Razorpay dashboard, and store organization.razorpaySubscriptionId.
  const order = await razorpay.orders.create({
    amount: target.price * 100, // paise
    currency: "INR",
    receipt: `${ctx.organizationId}-${plan}-${Date.now()}`,
    notes: { organizationId: ctx.organizationId, plan },
  });

  return Response.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}

module.exports = { POST };
