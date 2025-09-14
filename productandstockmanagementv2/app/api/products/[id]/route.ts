import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

// Helper function to extract ID from params
async function getIdFromParams(params: Promise<{ id: string }>) {
  const resolvedParams = await params;
  return resolvedParams.id;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = await getIdFromParams(params);
  
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Replace image URLs
    const fixedProduct = {
      ...product,
      images: product.images.map(img => ({
        ...img,
        url: img.url.replace('product-images', 'uploads'),
      })),
    };

    return NextResponse.json(fixedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = await getIdFromParams(params);

  try {
    // Check if environment variables exist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      );
    }

    // Await cookies first
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll().map(c => ({ name: c.name, value: c.value })),
          setAll: (cookiesToSet) =>
            cookiesToSet.forEach(c => cookieStore.set(c.name, c.value, { httpOnly: true })),
        },
      }
    );

    // Find product with images
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete images from Supabase storage
    for (const image of product.images) {
      if (image.url) {
        const path = image.url.split('/').slice(-2).join('/');
        const { error: deleteError } = await supabase.storage
          .from('uploads')
          .remove([path]);

        if (deleteError) {
          console.warn('Failed to delete image from storage:', deleteError);
          return NextResponse.json(
            { error: 'Failed to delete image from storage' }, 
            { status: 500 }
          );
        }
      }
    }

    // Delete images from DB
    await prisma.image.deleteMany({ where: { productId: id } });
    // Delete product
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Unable to delete product' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = await getIdFromParams(params);

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ details: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      discount,
      stock,
      sizes,
      gender,
      brand,
      warranty,
      returnPolicy,
      shipping,
      categoryIds,
      images,
    } = body;

    // Ensure max 5 images
    if (images && images.length > 5) {
      return NextResponse.json(
        { details: "Maximum 5 images allowed." },
        { status: 400 }
      );
    }

    // Check product ownership
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (existing?.userId !== session.user.id) {
      return NextResponse.json({ details: "Unauthorized" }, { status: 401 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.productSize.deleteMany({ where: { productId: id } });
      await tx.image.deleteMany({ where: { productId: id } });

      return tx.product.update({
        where: { id: id },
        data: {
          title,
          description,
          price: Number(price),
          discountPercentage: Number(discount) || 0,
          stock: Number(stock),
          gender,
          brand,
          warrantyInformation: warranty,
          returnPolicy,
          shippingInformation: shipping,
          category: {
            set: [],
            connect:
              Array.isArray(categoryIds) && categoryIds.length > 0
                ? categoryIds.map((id: string) => ({ id }))
                : [],
          },
          sizes: {
            create: Array.isArray(sizes)
              ? sizes.map((s: string) => ({ size: s.toUpperCase() }))
              : [],
          },
          images: {
            createMany: {
              data: Array.isArray(images)
                ? images.map((img: any) => ({
                    url: typeof img === "string" ? img : img.url,
                  }))
                : [],
            },
          },
        },
        include: { category: true, sizes: true, images: true },
      });
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ details: "Server error" }, { status: 500 });
  }
}