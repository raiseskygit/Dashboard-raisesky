"use client";

const { useEffect, useState } = require("react");

function ClientPortalPage({ params }) {
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/portal/${params.token}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error);
        setClient(data);
      })
      .catch((e) => setError(e.message));
  }, [params.token]);

  if (error) {
    return <p className="p-8 text-center text-red-600">{error}</p>;
  }
  if (!client) {
    return <p className="p-8 text-center text-gray-500">Loading…</p>;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase text-gray-400">{client.organization.name}</p>
        <h1 className="text-2xl font-bold">Welcome, {client.name}</h1>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Your projects</h2>
        <div className="space-y-3">
          {client.projects.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{p.title}</h3>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                  {p.status.replace("_", " ")}
                </span>
              </div>
              {p.description && <p className="mt-1 text-sm text-gray-500">{p.description}</p>}
            </div>
          ))}
          {client.projects.length === 0 && (
            <p className="text-sm text-gray-400">No projects yet.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Your invoices</h2>
        <div className="space-y-3">
          {client.invoices.map((inv) => (
            <div key={inv.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{inv.number}</p>
                  <p className="text-xs text-gray-500">
                    {inv.items.length} item{inv.items.length !== 1 ? "s" : ""} · GST {Number(inv.gstRate)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{Number(inv.total).toLocaleString("en-IN")}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      inv.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {client.invoices.length === 0 && (
            <p className="text-sm text-gray-400">No invoices yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

module.exports = ClientPortalPage;
