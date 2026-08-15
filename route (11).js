const { v4: uuidv4 } = require("uuid");
const prisma = require("../../../lib/prisma");
const { requireOrg } = require("../../../lib/apiAuth");
const { assertWithinLimit } = require("../../../lib/plans");

async function GET() {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(clients);
}

async function POST(req) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertWithinLimit(prisma, ctx.organizationId, ctx.plan, "client");
  } catch (e) {
    return Response.json({ error: e.message }, { status: 403 });
  }

  const body = await req.json();
  const client = await prisma.client.create({
    data: {
      organizationId: ctx.organizationId,
      name: body.name,
      company: body.company || null,
      email: body.email || null,
      phone: body.phone || null,
      gstin: body.gstin || null,
      notes: body.notes || null,
      portalToken: uuidv4(),
    },
  });
  return Response.json(client, { status: 201 });
}

module.exports = { GET, POST };
