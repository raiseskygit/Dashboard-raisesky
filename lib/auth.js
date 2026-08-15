const CredentialsProvider = require("next-auth/providers/credentials").default;
const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

const authOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { organization: true },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          organizationId: user.organizationId,
          organizationName: user.organization.name,
          plan: user.organization.plan,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.organizationId = user.organizationId;
        token.organizationName = user.organizationName;
        token.plan = user.plan;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.organizationId = token.organizationId;
      session.user.organizationName = token.organizationName;
      session.user.plan = token.plan;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

module.exports = { authOptions };
