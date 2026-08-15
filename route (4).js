const prisma = require("../../../lib/prisma");
const { requireOrg } = require("../../../lib/apiAuth");

async function GET() {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: ctx.organizationId },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(invoices);
}

async function nextInvoiceNumber(organizationId) {
  const count = await prisma.invoice.count({ where: { organizationId } });
  const year = new Date().getFullYear();
  return `INV-${year}-${String(count + 1).padStart(4, "0")}`;
}

async function POST(req) {
  const ctx = await requireOrg();
  if (!ctx) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const client = await prisma.client.findFirst({
    where: { id: body.clientId, organizationId: ctx.organizationId },
  });
  if (!client) return Response.json({ error: "Client not found" }, { status: 404 });

  const items = body.items || [];
  if (!items.length) {
    return Response.json({ error: "Add at least one line item." }, { status: 400 });
  }

  const subtotal = items.reduce((sum, it) => sum + Number(it.quantity) * Number(it.rate), 0);
  const gstRate = body.gstRate ?? 18;
  const gstAmount = Math.round((subtotal * gstRate) / 100 * 100) / 100;
  const total = Math.round((subtotal + gstAmount) * 100) / 100;

  const number = await nextInvoiceNumber(ctx.organizationId);

  const invoice = await prisma.invoice.create({
    data: {
      organizationId: ctx.organizationId,
      clientId: body.clientId,
      projectId: body.projectId || null,
      number,
      status: body.status || "DRAFT",
      subtotal,
      gstRate,
      gstAmount,
      total,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      items: {
        create: items.map((it) => ({
          description: it.description,
          quantity: it.quantity,
          rate: it.rate,
          amount: Math.round(Number(it.quantity) * Number(it.rate) * 100) / 100,
        })),
      },
    },
    include: { items: true, client: true },
  });

  return Response.json(invoice, { status: 201 });
}

module.exports = { GET, POST };
