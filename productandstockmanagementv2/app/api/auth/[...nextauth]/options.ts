import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
// import { NextAuthOptions } from "next-auth";


export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log('Receiving credentials:', credentials);
          
          // Check if credentials are provided
          if (!credentials?.email || !credentials.password) {
            throw new Error("Email and password are required");
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.email)) {
            throw new Error("Invalid email format");
          }

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("No user found with this email address");
          }

          // Check if user account is active
          if (!user.isActive) {
            throw new Error("Your account has been deactivated. Please contact support");
          }
// Verify password
if (!user.password) {
  throw new Error("User does not have a password set");
}

const isPasswordCorrect = await bcrypt.compare(
  credentials.password,
  user.password
);

if (!isPasswordCorrect) {
  throw new Error("Invalid password");
}

      

          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          // Return user data if authentication successful
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };

        } catch (error) {
          console.error('Authentication error:', error);
          // Return null to indicate authentication failure
          // The error message will be handled by the pages/signIn callback
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      httpOptions: {
        timeout: 10000, // 10 seconds
      },
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      try {
        if (account?.provider === 'google') {
          // Validate Google email
          if (!profile?.email || !profile.email.endsWith('@gmail.com')) {
            console.error('Invalid Google email or not a Gmail address');
            return false;
          }

          // Check if user already exists for Google sign-in
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email }
          });

          // If user exists but account is inactive
          if (existingUser && !existingUser.isActive) {
            console.error('Google user account is inactive');
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          // First login - add user data to token
          token.id = user.id;
          token.role = user.role;
        } else if (token.id) {
          // Subsequent requests - refresh user data from database
          const dbUser = await prisma.user.findUnique({ 
            where: { id: String(token.id) } 
          });
          
          if (dbUser) {
            token.role = dbUser.role;
            // Check if user is still active
            if (!dbUser.isActive) {
              console.error('User account deactivated during session');
              return null; // This will force user to sign in again
            }
          }
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = String(token.id);
          session.user.role = token.role;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Custom error page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};