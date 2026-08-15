const prisma = require("../../../lib/prisma");
const { requireOrg } = require("../../../lib/apiAuth");

async function GET() {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(leads);
}

async function POST(req) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Leads are unlimited on every plan (matches the CRM pipeline being
  // "unlimited leads" even on Free), so no plan-limit check here.
  const body = await req.json();
  const lead = await prisma.lead.create({
    data: {
      organizationId: ctx.organizationId,
      name: body.name,
      company: body.company || null,
      email: body.email || null,
      phone: body.phone || null,
      value: body.value || null,
      stage: body.stage || "NEW",
      nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : null,
      notes: body.notes || null,
    },
  });
  return Response.json(lead, { status: 201 });
}

module.exports = { GET, POST };
