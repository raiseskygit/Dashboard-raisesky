const prisma = require("../../../../lib/prisma");
const { requireOrg } = require("../../../../lib/apiAuth");

async function PATCH(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.lead.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
  });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: {
      name: body.name ?? existing.name,
      company: body.company ?? existing.company,
      email: body.email ?? existing.email,
      phone: body.phone ?? existing.phone,
      value: body.value ?? existing.value,
      stage: body.stage ?? existing.stage,
      nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : existing.nextFollowUp,
      notes: body.notes ?? existing.notes,
    },
  });
  return Response.json(lead);
}

async function DELETE(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.lead.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
  });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  await prisma.lead.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}

module.exports = { PATCH, DELETE };
