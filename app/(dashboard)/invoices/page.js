"use client";

const { useEffect, useState } = require("react");

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [clientId, setClientId] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0 }]);
  const [error, setError] = useState("");

  async function load() {
    const [inv, cl] = await Promise.all([
      fetch("/api/invoices").then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
    ]);
    setInvoices(inv);
    setClients(cl);
  }

  useEffect(() => {
    load();
  }, []);

  function updateItem(idx, field, value) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }

  const subtotal = items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.rate || 0), 0);
  const gstAmount = (subtotal * gstRate) / 100;
  const total = subtotal + gstAmount;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, gstRate, items, status: "SENT" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setItems([{ description: "", quantity: 1, rate: 0 }]);
    setClientId("");
    setShowForm(false);
    load();
  }

  async function markPaid(id) {
    await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAID" }),
    });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New invoice"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
          <select
            className="input"
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">Select client *</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input
                  className="input col-span-6"
                  placeholder="Description"
                  required
                  value={it.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                />
                <input
                  className="input col-span-2"
                  type="number"
                  placeholder="Qty"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                />
                <input
                  className="input col-span-3"
                  type="number"
                  placeholder="Rate (₹)"
                  value={it.rate}
                  onChange={(e) => updateItem(idx, "rate", e.target.value)}
                />
                <button
                  type="button"
                  className="col-span-1 text-red-500"
                  onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() => setItems((prev) => [...prev, { description: "", quantity: 1, rate: 0 }])}
            >
              + Add line item
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="label mb-0">GST %</label>
            <input
              className="input w-24"
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(Number(e.target.value))}
            />
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({gstRate}%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t pt-1 font-semibold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full">Create &amp; send invoice</button>
        </form>
      )}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{inv.number}</td>
                <td className="px-4 py-3">{inv.client?.name}</td>
                <td className="px-4 py-3">₹{Number(inv.total).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      inv.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {inv.status !== "PAID" && (
                    <button
                      onClick={() => markPaid(inv.id)}
                      className="text-xs text-brand hover:underline"
                    >
                      Mark paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

module.exports = InvoicesPage;
