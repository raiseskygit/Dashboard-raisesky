const crypto = require("crypto");
const prisma = require("../../../../lib/prisma");

// Configure this exact URL as the webhook endpoint in the Razorpay
// dashboard, subscribed to "payment.captured". Set RAZORPAY_WEBHOOK_SECRET
// to the secret shown there.
async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const notes = event.payload?.payment?.entity?.notes || {};
    const { organizationId, plan } = notes;
    if (organizationId && plan) {
      await prisma.organization.update({
        where: { id: organizationId },
        data: { plan },
      });
    }
  }

  return Response.json({ ok: true });
}

module.exports = { POST };
