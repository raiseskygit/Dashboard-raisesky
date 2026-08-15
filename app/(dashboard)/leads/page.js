"use client";

const { useEffect, useState } = require("react");

const STAGES = ["NEW", "CONTACTED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", value: "" });

  async function load() {
    const res = await fetch("/api/leads");
    setLeads(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", company: "", email: "", value: "" });
    setShowForm(false);
    load();
  }

  async function moveStage(id, stage) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads &amp; CRM pipeline</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add lead"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 grid gap-3 sm:grid-cols-2">
          <input
            className="input"
            placeholder="Name *"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            className="input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            placeholder="Deal value (₹)"
            type="number"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
          <button className="btn-primary col-span-2">Save lead</button>
        </form>
      )}

      <div className="grid grid-cols-2 gap-3 overflow-x-auto md:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((stage) => (
          <div key={stage} className="min-w-[160px]">
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
              {stage.replace("_", " ")} ({leads.filter((l) => l.stage === stage).length})
            </p>
            <div className="space-y-2">
              {leads
                .filter((l) => l.stage === stage)
                .map((lead) => (
                  <div key={lead.id} className="card p-3">
                    <p className="text-sm font-medium">{lead.name}</p>
                    {lead.company && <p className="text-xs text-gray-500">{lead.company}</p>}
                    {lead.value && (
                      <p className="mt-1 text-xs font-semibold text-brand">
                        ₹{Number(lead.value).toLocaleString("en-IN")}
                      </p>
                    )}
                    <select
                      className="mt-2 w-full rounded border border-gray-200 text-xs"
                      value={lead.stage}
                      onChange={(e) => moveStage(lead.id, e.target.value)}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

module.exports = LeadsPage;
