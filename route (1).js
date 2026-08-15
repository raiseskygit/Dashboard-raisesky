const prisma = require("../../../lib/prisma");
const { requireOrg } = require("../../../lib/apiAuth");
const { assertWithinLimit } = require("../../../lib/plans");

async function GET() {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { organizationId: ctx.organizationId },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(projects);
}

async function POST(req) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await assertWithinLimit(prisma, ctx.organizationId, ctx.plan, "project");
  } catch (e) {
    return Response.json({ error: e.message }, { status: 403 });
  }

  const body = await req.json();
  const client = await prisma.client.findFirst({
    where: { id: body.clientId, organizationId: ctx.organizationId },
  });
  if (!client) return Response.json({ error: "Client not found" }, { status: 404 });

  const project = await prisma.project.create({
    data: {
      organizationId: ctx.organizationId,
      clientId: body.clientId,
      title: body.title,
      description: body.description || null,
      status: body.status || "TODO",
      budget: body.budget || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
  });
  return Response.json(project, { status: 201 });
}

module.exports = { GET, POST };
