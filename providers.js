"use client";

const { SessionProvider } = require("next-auth/react");

function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

module.exports = Providers;
