import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },

  pages: {
    signIn: "/signin",   // 未登入時導去這裡
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        // 1. 用 email 查 DB
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // 2. 使用者不存在 or 已停用 → 拒絕
        if (!user || user.status !== "ACTIVE") return null;

        // 3. 比對密碼
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        // 4. 驗證通過，回傳精簡的 user 物件（不含 passwordHash）
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // 登入成功時把 role 塞進 JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    // 每次讀 session 時，把 JWT 裡的 role 塞進 session 物件
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
});