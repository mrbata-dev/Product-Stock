import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface WhereClause {
  OR?: {
    name?: {
      contains: string;
      mode: "insensitive";
    };
    email?: {
      contains: string;
      mode: "insensitive";
    };
  }[];
  role?: string;
}

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");

  
    const whereClause: WhereClause = {};

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive", 
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Add role filter with proper type casting
    if (role && role !== "all") {
      whereClause.role = role as string; 
    }

    const customers = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
  }
};