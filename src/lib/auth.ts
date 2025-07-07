import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    // Only include Facebook if both client ID and secret are available
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          // First check for test user
          if (
            credentials.username === "admin" &&
            credentials.password === "admin"
          ) {
            return {
              id: "1",
              name: "admin",
              email: "admin@example.com",
            };
          }

          // Check database for real users
          try {
            const user = await db
              .select()
              .from(users)
              .where(eq(users.username, credentials.username as string))
              .limit(1);

            if (user.length > 0) {
              const isValidPassword = await bcrypt.compare(
                credentials.password as string,
                user[0].password
              );

              if (isValidPassword) {
                return {
                  id: user[0].id.toString(),
                  name: user[0].username,
                  email: user[0].email,
                };
              }
            }
          } catch (dbError) {
            console.error("Database auth error:", dbError);
            // Continue to return null if database fails
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
