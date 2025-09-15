import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.product.count({
      where: {
        stock: {
          lte: 5 // Consider products with 5 or less items as low stock
        }
      }
    });
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch low stock products' },
      { status: 500 }
    );
  }
}