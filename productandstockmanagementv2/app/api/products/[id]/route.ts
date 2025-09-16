import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { z } from 'zod';

// ============ VALIDATION SCHEMAS ============
const UpdateProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  discount: z.number().min(0).max(100).default(0),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sizes: z.array(z.string()).default([]),
  gender: z.enum(["male", "female", "unisex"]),
  brand: z.string().min(1),
  warranty: z.string().optional(),
  returnPolicy: z.string().optional(),
  shipping: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  images: z.array(z.string()).max(5, "Maximum 5 images allowed").default([]),
});

// ============ TYPE DEFINITIONS ============
type UpdateProductData = z.infer<typeof UpdateProductSchema>;

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

// ============ HELPER FUNCTIONS ============
async function getIdFromParams(params: Promise<{ id: string }>): Promise<string> {
  const resolvedParams = await params;
  return resolvedParams.id;
}

function createSupabaseClient() {
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  return async () => {
    const cookieStore = await cookies();
    return createServerClient(
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
  };
}

async function deleteImagesFromStorage(images: ProductImage[]) {
  const getSupabase = createSupabaseClient();
  const supabase = await getSupabase();
  const errors: string[] = [];

  for (const image of images) {
    if (image.url) {
      try {
        // Extract the path from the URL
        const urlParts = image.url.split('/');
        const path = urlParts.slice(-2).join('/');
        
        const { error: deleteError } = await supabase.storage
          .from('uploads')
          .remove([path]);

        if (deleteError) {
          errors.push(`Failed to delete image ${path}: ${deleteError.message}`);
          console.warn('Failed to delete image from storage:', deleteError);
        }
      } catch (error) {
        errors.push(`Error processing image ${image.url}`);
        console.error('Error deleting image:', error);
      }
    }
  }

  return errors;
}

async function handleStockNotification(product: any) {
  try {
    if (product.stock > 5) {
      // Stock is healthy, delete notifications
      await prisma.notification.deleteMany({
        where: { productId: product.id },
      });
    } else if (product.stock <= 5 && product.stock >= 0) {
      // Check for existing notification
      const existingNotification = await prisma.notification.findFirst({
        where: { productId: product.id, read: false },
      });

      if (!existingNotification) {
        await prisma.notification.create({
          data: {
            message: `Stock for ${product.title} is critically low at ${product.stock} units.`,
            productId: product.id,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error handling stock notification:', error);
    // Don't throw - this is non-critical
  }
}

// ============ API ROUTES ============

// GET /api/products/[id] - Fetch single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);
    
    // Validate ID exists (removed format check - Prisma handles ID validation)
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { 
        images: true, 
        category: true,
        sizes: true
      },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
    }

    // Fix image URLs if needed
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
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch product', details: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch product' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let storageErrors: string[] = [];
  
  try {
    const id = await getIdFromParams(params);
    
    // Validate ID exists (removed format check - Prisma handles ID validation)
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }

    // Find product with all relations
    const product = await prisma.product.findUnique({
      where: { id },
      include: { 
        images: true,
        sizes: true,
        category: true 
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
    }

    // Start transaction for database operations
    await prisma.$transaction(async (tx) => {
      // 1. Delete related notifications first
      await tx.notification.deleteMany({
        where: { productId: id }
      });

      // 2. Delete sizes
      await tx.productSize.deleteMany({
        where: { productId: id }
      });

      // 3. Delete images from database
      await tx.image.deleteMany({
        where: { productId: id }
      });

      // 4. Finally delete the product
      await tx.product.delete({
        where: { id }
      });
    });

    // After successful DB deletion, try to delete from storage
    // This is done outside transaction as it's external service
    if (product.images.length > 0) {
      storageErrors = await deleteImagesFromStorage(product.images);
    }

    // Return success with any storage warnings
    const response: any = {
      message: 'Product deleted successfully',
      productId: id,
      productTitle: product.title
    };

    if (storageErrors.length > 0) {
      response.warnings = storageErrors;
      console.warn('Storage cleanup warnings:', storageErrors);
    }

    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Delete product error:', error);
    
    // Handle Prisma-specific errors
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { 
            error: 'Cannot delete product', 
            details: 'This product has related records that must be deleted first'
          }, 
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to delete product', 
          details: error.message 
        }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unable to delete product' }, 
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Please login to continue' }, 
        { status: 401 }
      );
    }

    const id = await getIdFromParams(params);
    
    // Validate ID exists (removed format check - Prisma handles ID validation)
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = UpdateProductSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { id: true, title: true }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
    }

    // Verify categories exist
    const categories = await prisma.category.findMany({
      where: { id: { in: data.categoryIds } }
    });

    if (categories.length !== data.categoryIds.length) {
      return NextResponse.json(
        { 
          error: 'Invalid category IDs', 
          details: 'One or more categories do not exist' 
        },
        { status: 400 }
      );
    }

    // Update product in transaction
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Delete existing related data
      await tx.productSize.deleteMany({ where: { productId: id } });
      await tx.image.deleteMany({ where: { productId: id } });

      // Update product with new data
      return tx.product.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          discountPercentage: data.discount,
          stock: data.stock,
          gender: data.gender,
          brand: data.brand,
          warrantyInformation: data.warranty || '',
          returnPolicy: data.returnPolicy || '',
          shippingInformation: data.shipping || '',
          // Update categories
          category: {
            set: [], // Clear existing
            connect: data.categoryIds.map(categoryId => ({ id: categoryId }))
          },
          // Create new sizes
          sizes: {
            create: data.sizes.map(size => ({ 
              size: size.toUpperCase() 
            }))
          },
          // Create new images
          images: {
            createMany: {
              data: data.images.map(imageUrl => ({ url: imageUrl }))
            }
          }
        },
        include: { 
          category: true, 
          sizes: true, 
          images: true 
        }
      });
    });

    // Handle stock notifications (non-blocking)
    await handleStockNotification(updatedProduct);

    return NextResponse.json(
      {
        message: 'Product updated successfully',
        product: updatedProduct
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error instanceof Error) {
      // Handle specific database errors
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { 
            error: 'Update failed', 
            details: 'A product with similar details already exists' 
          },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to update product', 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Server error while updating product' }, 
      { status: 500 }
    );
  }
}