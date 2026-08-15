const Providers = require("./providers");
require("./globals.css");

const metadata = {
  title: "Your SaaS — Client, CRM, Invoicing & Portal Workspace",
  description: "Manage clients, leads, projects, and GST-ready invoices in one place.",
};

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

module.exports = RootLayout;
module.exports.metadata = metadata;
