const bcrypt = require("bcryptjs");
const prisma = require("../../../lib/prisma");

async function POST(req) {
  const { name, email, password, companyName } = await req.json();

  if (!name || !email || !password || !companyName) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return Response.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const org = await prisma.organization.create({
    data: {
      name: companyName,
      plan: "FREE",
      users: {
        create: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          role: "OWNER",
        },
      },
    },
  });

  return Response.json({ ok: true, organizationId: org.id });
}

module.exports = { POST };
