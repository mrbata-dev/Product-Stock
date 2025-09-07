import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Query a table (replace 'User' with your model name)
    const users = await prisma.dbTest.findMany();
    
    return NextResponse.json({ 
      success: true, 
      data: users,
      message: "Connected to Supabase via Prisma!"
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to connect to the database."
    }, { status: 500 });
  }
}