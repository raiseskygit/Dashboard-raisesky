const { withAuth } = require("next-auth/middleware");

module.exports = withAuth({
  pages: { signIn: "/login" },
});

module.exports.config = {
  matcher: ["/dashboard/:path*", "/clients/:path*", "/leads/:path*", "/projects/:path*", "/invoices/:path*", "/settings/:path*"],
};
