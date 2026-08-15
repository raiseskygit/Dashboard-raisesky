"use client";

const { useSession } = require("next-auth/react");
const Script = require("next/script").default;
const { useState } = require("react");
const PricingCards = require("../../../components/PricingCards");

function SettingsPage() {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");

  async function upgrade(plan) {
    setMessage("");
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
      return;
    }
    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "YourSaaS",
      description: `Upgrade to ${plan}`,
      handler: function () {
        setMessage("Payment received — your plan will update shortly.");
      },
      theme: { color: "#ea580c" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <h1 className="mb-2 text-2xl font-bold">Settings &amp; billing</h1>
      <p className="mb-6 text-sm text-gray-500">
        Current plan: <span className="font-semibold">{session?.user?.plan}</span>
      </p>

      {message && <p className="mb-4 text-sm text-brand">{message}</p>}

      <PricingCards />

      <div className="mt-6 flex gap-3">
        <button className="btn-secondary" onClick={() => upgrade("PRO")}>
          Upgrade to Pro (test payment)
        </button>
        <button className="btn-secondary" onClick={() => upgrade("ULTRA")}>
          Upgrade to Ultra (test payment)
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Requires RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET set in your environment.
        The plan upgrades automatically once the Razorpay webhook confirms payment.
      </p>
    </div>
  );
}

module.exports = SettingsPage;
