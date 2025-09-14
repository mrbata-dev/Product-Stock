import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // console.log('Fetching categories...');
    const categories = await prisma.category.findMany({
      orderBy: { title: "asc" }
    });
    
    // console.log('Categories fetched:', categories.length);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log('POST request received');
    const body = await req.json();
    console.log('Request body:', body);
    
    const { title } = body;
    
    if (!title || !title.trim()) {
      console.log('Invalid title provided');
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    console.log('Checking for existing category with title:', title.trim());
    const existing = await prisma.category.findUnique({ 
      where: { title: title.trim() } 
    });
    
    if (existing) {
      console.log('Category already exists:', existing);
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    // Create new category
    console.log('Creating new category with title:', title.trim());
    const newCategory = await prisma.category.create({
      data: { title: title.trim() },
    });
    
    console.log('New category created:', newCategory);
    
    // Return the created category
    return NextResponse.json(newCategory, { status: 201 });
    
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
}