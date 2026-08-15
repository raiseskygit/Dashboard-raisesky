"use client";

const PLAN_DISPLAY = [
  {
    key: "FREE",
    name: "Free",
    tagline: "For getting started",
    price: 0,
    original: null,
    cta: "Get started free",
    href: "/signup",
    features: [
      "Up to 5 clients",
      "Up to 10 projects",
      "Full leads & CRM pipeline (unlimited leads)",
      "Invoice generation",
      "Meetings & reminders",
      "Basic analytics",
    ],
  },
  {
    key: "PRO",
    name: "Pro",
    tagline: "For growing freelancers",
    badge: "Most popular",
    price: 199,
    original: 499,
    cta: "Start Pro →",
    href: "/signup",
    features: [
      "Up to 30 clients",
      "Up to 60 projects",
      "Up to 5 team members",
      "Full invoice system",
      "White-label client portal",
      "Calendar integration",
      "Project files & payments",
      "Priority support",
    ],
  },
  {
    key: "ULTRA",
    name: "Ultra",
    tagline: "For agencies at scale",
    price: 799,
    original: 1999,
    cta: "Start Ultra →",
    href: "/signup",
    features: [
      "Unlimited clients",
      "Unlimited projects",
      "Unlimited team members",
      "White-label invoices",
      "Lead follow-up push reminders",
      "Everything in Pro",
      "Dedicated support",
    ],
  },
];

function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PLAN_DISPLAY.map((plan) => (
        <div
          key={plan.key}
          className={`card relative flex flex-col ${
            plan.badge ? "border-brand ring-1 ring-brand" : ""
          }`}
        >
          {plan.badge && (
            <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
              {plan.badge}
            </span>
          )}
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="text-sm text-gray-500">{plan.tagline}</p>
          <div className="mt-4 flex items-baseline gap-2">
            {plan.original && (
              <span className="text-sm text-gray-400 line-through">₹{plan.original}</span>
            )}
            <span className="text-3xl font-bold">₹{plan.price}</span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
          <ul className="mt-6 flex-1 space-y-2 text-sm text-gray-700">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-brand">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <a href={plan.href} className="btn-primary mt-6">
            {plan.cta}
          </a>
        </div>
      ))}
    </div>
  );
}

module.exports = PricingCards;
