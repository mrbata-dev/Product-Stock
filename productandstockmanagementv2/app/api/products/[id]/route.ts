import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

// Type definitions
interface ProductImage {
  id: string;
  url: string;
  productId?: string;
}

interface ProductCategory {
  id: string;
  title: string;
}

interface ProductSize {
  id: string;
  size: string;
  productId: string;
}

interface UpdateProductData {
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  sizes: string[];
  gender: "male" | "female" | "unisex";
  brand: string;
  warranty: string;
  returnPolicy: string;
  shipping: string;
  categoryIds: string[];
  images: string[];
}

async function getIdFromParams(params: Promise<{ id: string }>): Promise<string> {
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
      include: { 
        images: true, 
        category: true,
        sizes: true  // Include sizes in the response
      },
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Replace image URLs to fix path issues
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

    const body: UpdateProductData = await req.json();
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

    // Validate input data
    if (!title || !description) {
      return NextResponse.json(
        { details: "Title and description are required" },
        { status: 400 }
      );
    }

    // Ensure max 5 images
    if (images && images.length > 5) {
      return NextResponse.json(
        { details: "Maximum 5 images allowed." },
        { status: 400 }
      );
    }

    // Validate categoryIds array
    if (categoryIds && !Array.isArray(categoryIds)) {
      return NextResponse.json(
        { details: "Category IDs must be an array" },
        { status: 400 }
      );
    }

    // Validate sizes array
    if (sizes && !Array.isArray(sizes)) {
      return NextResponse.json(
        { details: "Sizes must be an array" },
        { status: 400 }
      );
    }

    // Check product existence
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { category: true, sizes: true, images: true }
    });

    if (!existingProduct) {
      return NextResponse.json({ details: "Product not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Delete existing sizes and images
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
          warrantyInformation: warranty || '',
          returnPolicy: returnPolicy || '',
          shippingInformation: shipping || '',
          // Update categories
          category: {
            set: [], // Clear existing relationships
            connect: Array.isArray(categoryIds) && categoryIds.length > 0
              ? categoryIds.map((categoryId: string) => ({ id: categoryId }))
              : [],
          },
          // Create new sizes
          sizes: {
            create: Array.isArray(sizes) && sizes.length > 0
              ? sizes.map((size: string) => ({ size: size.toUpperCase() }))
              : [],
          },
          // Create new images
          images: {
            createMany: {
              data: Array.isArray(images) && images.length > 0
                ? images.map((imageUrl: string) => ({ url: imageUrl }))
                : [],
            },
          },
        },
        include: { 
          category: true, 
          sizes: true, 
          images: true 
        },
      });
    });

    // Handle stock notifications
    if (updated.stock > 5) {
      // If stock is now healthy, delete all notifications for this product.
      await prisma.notification.deleteMany({
        where: { productId: updated.id },
      });
    } else if (updated.stock <= 5 && updated.stock >= 0) {
      const existingNotification = await prisma.notification.findFirst({
        where: { productId: updated.id, read: false },
      });

      if (!existingNotification) {
        await prisma.notification.create({
          data: {
            message: `Stock for ${updated.title} is critically low at ${updated.stock} units.`,
            productId: updated.id,
          },
        });
      }
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { details: `Server error: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ details: "Server error" }, { status: 500 });
  }
}