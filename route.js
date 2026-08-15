const prisma = require("../../../../lib/prisma");
const { requireOrg } = require("../../../../lib/apiAuth");

async function PATCH(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.project.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
  });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      status: body.status ?? existing.status,
      budget: body.budget ?? existing.budget,
      dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
    },
  });
  return Response.json(project);
}

async function DELETE(req, { params }) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.project.findFirst({
    where: { id: params.id, organizationId: ctx.organizationId },
  });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  await prisma.project.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}

module.exports = { PATCH, DELETE };
