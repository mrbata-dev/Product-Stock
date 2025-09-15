import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return mock data until orders are implemented
    const total = Math.floor(Math.random() * 50000) + 10000; // Random revenue between $10k-$60k
    
    return NextResponse.json({ total });
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    return NextResponse.json({ total: 0 });
  }
}