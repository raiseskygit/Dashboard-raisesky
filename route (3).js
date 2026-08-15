const prisma = require("../../../../lib/prisma");
const { requireOrg } = require("../../../../lib/apiAuth");

async function GET(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
    include: { items: true, client: true, organization: true },
  });
  if (!invoice) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(invoice);
}

async function PATCH(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.invoice.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
  });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const invoice = await prisma.invoice.update({
    where: { id: params.id },
    data: {
      status: body.status ?? existing.status,
      paidAt: body.status === "PAID" ? new Date() : existing.paidAt,
    },
  });
  return Response.json(invoice);
}

async function DELETE(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.invoice.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
  });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  await prisma.invoice.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}

module.exports = { GET, PATCH, DELETE };
