import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { Role } from "@prisma/client";

// Type declarations - Place these at the top of the file or in a separate types file
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      name?: string | null;
      email?: string | null;
    }
  }
  
  interface User {
    id: string;
    role: Role;
    name?: string | null;
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    email?: string | null;
    name?: string | null;
  }
}

// Custom error classes
class AuthError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

// Error messages
const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  MISSING_CREDENTIALS: "Email and password are required",
  INVALID_EMAIL: "Please enter a valid email address",
  ACCOUNT_INACTIVE: "Your account has been deactivated. Please contact support",
  PASSWORD_NOT_SET: "Please use Google sign-in or reset your password",
  RATE_LIMIT: "Too many login attempts. Please try again later",
  DATABASE_ERROR: "An error occurred. Please try again",
} as const;

// Email validation
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Simple rate limiting
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const limit = loginAttempts.get(email);
  
  if (!limit || limit.resetTime < now) {
    loginAttempts.set(email, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
  }
  
  if (limit.count >= 5) {
    return false;
  }
  
  limit.count++;
  return true;
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  loginAttempts.forEach((value, key) => {
    if (value.resetTime < now) {
      loginAttempts.delete(key);
    }
  });
}, 60 * 60 * 1000);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials): Promise<User | null> {
        try {
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            console.error(AUTH_ERRORS.MISSING_CREDENTIALS);
            return null;
          }

          const email = credentials.email.toLowerCase().trim();
          
          // Rate limiting
          if (!checkRateLimit(email)) {
            console.error(AUTH_ERRORS.RATE_LIMIT);
            return null;
          }

          // Email validation
          if (!isValidEmail(email)) {
            console.error(AUTH_ERRORS.INVALID_EMAIL);
            return null;
          }

          // Get user from database
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              isActive: true,
            }
          }).catch((error) => {
            console.error('Database error:', error);
            return null;
          });

          if (!user) {
            console.error('User not found:', email);
            return null;
          }

          // Check account status
          if (!user.isActive) {
            console.error('Account inactive:', email);
            return null;
          }

          // Check password exists
          if (!user.password) {
            console.error('No password set for user:', email);
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          ).catch(() => false);

          if (!isValid) {
            console.error('Invalid password for user:', email);
            return null;
          }

          // Return user object that matches NextAuth User type
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };

        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000,
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        if (!profile?.email) {
          return false;
        }

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            select: { isActive: true }
          });

          if (existingUser && !existingUser.isActive) {
            return false;
          }
        } catch (error) {
          console.error('Error checking user:', error);
          return false;
        }
      }
      
      return true;
    },
    
    async jwt({ token, user }): Promise<JWT> {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          email: user.email,
          name: user.name,
        };
      }
      
      // Return previous token if no update needed
      return token;
    },
    
    async session({ session, token }) {
      // Add user info to session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      
      return session;
    },
  },
  
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
  },
  
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};