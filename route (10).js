const prisma = require("../../../../lib/prisma");
const { requireOrg } = require("../../../../lib/apiAuth");

async function GET(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const client = await prisma.client.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
    include: { projects: true, invoices: true },
  });
  if (!client) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(client);
}

async function PATCH(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.client.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
  });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const client = await prisma.client.update({
    where: { id: params.id },
    data: {
      name: body.name ?? existing.name,
      company: body.company ?? existing.company,
      email: body.email ?? existing.email,
      phone: body.phone ?? existing.phone,
      gstin: body.gstin ?? existing.gstin,
      notes: body.notes ?? existing.notes,
    },
  });
  return Response.json(client);
}

async function DELETE(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.client.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
  });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  await prisma.client.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}

module.exports = { GET, PATCH, DELETE };
