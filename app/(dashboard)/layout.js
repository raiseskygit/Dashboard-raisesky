const { getServerSession } = require("next-auth");
const { redirect } = require("next/navigation");
const { authOptions } = require("../../lib/auth");
const DashboardNav = require("../../components/DashboardNav");

async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav user={session.user} />
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  );
}

module.exports = DashboardLayout;
