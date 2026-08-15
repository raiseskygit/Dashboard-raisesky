// Central definition of plan limits & pricing (INR/month), mirroring a
// Free / Pro / Ultra structure. Edit freely to change your own pricing.
const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    maxClients: 5,
    maxProjects: 10,
    maxTeamMembers: 0,
    whiteLabelPortal: false,
    whiteLabelInvoices: false,
    prioritySupport: false,
    features: [
      "Up to 5 clients",
      "Up to 10 projects",
      "Full leads & CRM pipeline",
      "Invoice generation",
      "Meetings & reminders",
      "Basic analytics",
    ],
  },
  PRO: {
    name: "Pro",
    price: 199, // launch price; strike-through original can be shown in UI
    originalPrice: 499,
    maxClients: 30,
    maxProjects: 60,
    maxTeamMembers: 5,
    whiteLabelPortal: true,
    whiteLabelInvoices: false,
    prioritySupport: true,
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
  ULTRA: {
    name: "Ultra",
    price: 799,
    originalPrice: 1999,
    maxClients: Infinity,
    maxProjects: Infinity,
    maxTeamMembers: Infinity,
    whiteLabelPortal: true,
    whiteLabelInvoices: true,
    prioritySupport: true,
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
};

function limitsFor(plan) {
  return PLANS[plan] || PLANS.FREE;
}

// Throws a plain Error with a user-facing message if the org is at/over
// its plan limit for a given resource. Call before creating a new row.
async function assertWithinLimit(prisma, organizationId, plan, resource) {
  const limits = limitsFor(plan);
  const counters = {
    client: { model: "client", max: limits.maxClients, label: "clients" },
    project: { model: "project", max: limits.maxProjects, label: "projects" },
  };
  const cfg = counters[resource];
  if (!cfg || cfg.max === Infinity) return;
  const count = await prisma[cfg.model].count({ where: { organizationId } });
  if (count >= cfg.max) {
    throw new Error(
      `Your ${limits.name} plan allows up to ${cfg.max} ${cfg.label}. Upgrade to add more.`
    );
  }
}

module.exports = { PLANS, limitsFor, assertWithinLimit };
