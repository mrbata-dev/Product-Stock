// app/api/products/stats/total/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.product.count();
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching total products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total products' },
      { status: 500 }
    );
  }
}

// app/api/products/stats/low-stock/route.ts


// app/api/orders/stats/total/route.ts
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function GET() {
//   try {
//     // Assuming you have an Order model, adjust according to your schema
//     const count = await prisma.order.count();
    
//     return NextResponse.json({ count });
//   } catch (error) {
//     console.error('Error fetching total orders:', error);
//     // If orders table doesn't exist yet, return 0
//     return NextResponse.json({ count: 0 });
//   }
// }

// app/api/orders/stats/revenue/route.ts
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function GET() {
//   try {
//     // Calculate total revenue from all orders
//     const result = await prisma.order.aggregate({
//       _sum: {
//         total: true
//       }
//     });
    
//     const total = result._sum.total || 0;
    
//     return NextResponse.json({ total });
//   } catch (error) {
//     console.error('Error fetching total revenue:', error);
//     // If orders table doesn't exist yet, return 0
//     return NextResponse.json({ total: 0 });
//   }
// }




// export async function GET() {
//   try {
//     // Return mock data until orders are implemented
//     const count = Math.floor(Math.random() * 100) + 50; // Random number between 50-150
    
//     return NextResponse.json({ count });
//   } catch (error) {
//     console.error('Error fetching total orders:', error);
//     return NextResponse.json({ count: 0 });
//   }
// }

// app/api/orders/stats/revenue/route.ts (fallback version)
