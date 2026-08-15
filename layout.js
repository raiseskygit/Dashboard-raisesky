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
// next-auth v4's getServerSession doesn't reliably signal "dynamic" to
// Next.js under the App Router, so without this the build tries to
// statically prerender these pages (with no real request/session) and
// fails. Forcing dynamic rendering for the whole (dashboard) route group
// fixes the "Export encountered errors on following paths" build error.
module.exports.dynamic = "force-dynamic";
