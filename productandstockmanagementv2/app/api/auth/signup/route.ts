import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

interface SignupRequestBody {
  uname: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    // Parse request body
    let body: SignupRequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { uname, email, password } = body;

    // Validate required fields
    if (!uname || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required (name, email, password)" },
        { status: 400 }
      );
    }

    // Validate field types
    if (typeof uname !== "string" || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "All fields must be valid strings" },
        { status: 400 }
      );
    }

    // Name validation
    if (uname.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email address" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: uname.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);

    // Type narrowing for Prisma errors
    if (error instanceof Error) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2002") {
        return NextResponse.json(
          { error: "User already exists with this email address" },
          { status: 409 }
        );
      }
      if (prismaError.code === "P2025") {
        return NextResponse.json(
          { error: "Database operation failed" },
          { status: 500 }
        );
      }
      if (error.message.includes("connect") || error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Database connection failed. Please try again later" },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later" },
      { status: 500 }
    );
  }
}
