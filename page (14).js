"use client";

const { useEffect, useState } = require("react");

const STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", clientId: "", budget: "", dueDate: "" });
  const [error, setError] = useState("");

  async function load() {
    const [p, c] = await Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
    ]);
    setProjects(p);
    setClients(c);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setForm({ title: "", clientId: "", budget: "", dueDate: "" });
    setShowForm(false);
    load();
  }

  async function updateStatus(id, status) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 grid gap-3 sm:grid-cols-2">
          <input
            className="input"
            placeholder="Project title *"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select
            className="input"
            required
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          >
            <option value="">Select client *</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Budget (₹)"
            type="number"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />
          <input
            className="input"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
          <button className="btn-primary col-span-2">Save project</button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div key={p.id} className="card">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-500">{p.client?.name}</p>
            {p.budget && (
              <p className="mt-1 text-sm font-medium text-brand">
                ₹{Number(p.budget).toLocaleString("en-IN")}
              </p>
            )}
            <select
              className="input mt-3"
              value={p.status}
              onChange={(e) => updateStatus(p.id, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-gray-400">No projects yet.</p>
        )}
      </div>
    </div>
  );
}

module.exports = ProjectsPage;
