const PricingCards = require("../components/PricingCards");

function HomePage() {
  return (
    <main>
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-brand">YourSaaS</span>
          <nav className="flex items-center gap-4 text-sm">
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              Sign in
            </a>
            <a href="/signup" className="btn-primary">
              Get started
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Simple, honest pricing
        </h1>
        <p className="mt-3 text-gray-600">
          Start free and upgrade only when you're ready. No hidden fees, no credit
          card to start, cancel anytime.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <PricingCards />
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Everything in one workspace
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Client management", "Every client's details, projects & history in one profile."],
            ["CRM & lead pipeline", "Track leads on a visual pipeline before they become clients."],
            ["Project management", "Status boards, deadlines & budgets for every project."],
            ["Invoicing & payments", "GST-ready invoices, PDF export & payment tracking."],
            ["Client portal", "A white-label login where clients view work & pay."],
            ["Row-level security", "Every organization's data is isolated and encrypted."],
          ].map(([title, desc]) => (
            <div key={title} className="card">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} YourSaaS. All rights reserved.
      </footer>
    </main>
  );
}

module.exports = HomePage;
