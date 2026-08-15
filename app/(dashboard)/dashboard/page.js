"use client";

const { useEffect, useState } = require("react");

function DashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      const [clients, leads, projects, invoices] = await Promise.all([
        fetch("/api/clients").then((r) => r.json()),
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/invoices").then((r) => r.json()),
      ]);
      const revenue = invoices
        .filter((i) => i.status === "PAID")
        .reduce((sum, i) => sum + Number(i.total), 0);
      const outstanding = invoices
        .filter((i) => i.status !== "PAID")
        .reduce((sum, i) => sum + Number(i.total), 0);
      setStats({
        clients: clients.length,
        leads: leads.length,
        projects: projects.length,
        invoices: invoices.length,
        revenue,
        outstanding,
      });
    }
    load();
  }, []);

  if (!stats) return <p className="text-gray-500">Loading…</p>;

  const cards = [
    ["Clients", stats.clients],
    ["Open leads", stats.leads],
    ["Active projects", stats.projects],
    ["Invoices raised", stats.invoices],
    ["Revenue collected", `₹${stats.revenue.toLocaleString("en-IN")}`],
    ["Outstanding", `₹${stats.outstanding.toLocaleString("en-IN")}`],
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="card">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

module.exports = DashboardHome;
