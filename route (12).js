const prisma = require("../../../../lib/prisma");

// Public endpoint: a client reaches their portal via a magic-link token,
// no password. Only ever returns data scoped to that one client row.
async function GET(req, { params }) {
  const client = await prisma.client.findUnique({
    where: { portalToken: params.token },
    include: {
      projects: { orderBy: { createdAt: "desc" } },
      invoices: { include: { items: true }, orderBy: { createdAt: "desc" } },
      organization: { select: { name: true, plan: true } },
    },
  });
  if (!client) return Response.json({ error: "Invalid or expired link" }, { status: 404 });

  return Response.json(client);
}

module.exports = { GET };
