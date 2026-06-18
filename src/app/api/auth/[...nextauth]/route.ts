import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password harus diisi.")
        }
        
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })

        if (!user) {
          throw new Error("Username tidak ditemukan.")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Password salah.")
        }

        return {
          id: user.id,
          name: user.username,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          name: token.name,
          // You can type extend session if you need user id, but simple name is enough here
        } as any
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "tintar-super-secret-key",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
