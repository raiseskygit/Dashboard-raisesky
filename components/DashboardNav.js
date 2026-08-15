"use client";

const { signOut } = require("next-auth/react");
const { usePathname } = require("next/navigation");

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads / CRM" },
  { href: "/clients", label: "Clients" },
  { href: "/projects", label: "Projects" },
  { href: "/invoices", label: "Invoices" },
  { href: "/settings", label: "Settings & Billing" },
];

function DashboardNav({ user }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r bg-white p-4">
      <div className="mb-6">
        <p className="text-lg font-bold text-brand">YourSaaS</p>
        <p className="mt-1 truncate text-xs text-gray-500">{user.organizationName}</p>
        <span className="mt-1 inline-block rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand">
          {user.plan} plan
        </span>
      </div>
      <nav className="flex-1 space-y-1">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`block rounded-lg px-3 py-2 text-sm ${
              pathname === link.href
                ? "bg-brand-light font-medium text-brand"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 rounded-lg px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
      >
        Sign out
      </button>
    </aside>
  );
}

module.exports = DashboardNav;
