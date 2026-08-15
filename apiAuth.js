const { getServerSession } = require("next-auth");
const { authOptions } = require("./auth");

// Returns { organizationId, plan, userId } or null if not authenticated.
// Every API route MUST use this and scope every Prisma query with
// organizationId — this is the row-level isolation boundary.
async function requireOrg() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) return null;
  return {
    organizationId: session.user.organizationId,
    plan: session.user.plan,
    userId: session.user.id,
    role: session.user.role,
  };
}

module.exports = { requireOrg };
