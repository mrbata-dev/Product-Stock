import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';

// Meta Tag auto generated
// const generateMetaTag = (title: string, description:string, brand?: string, slug?: string)=>{
//   const cleanDescription = description
//   ? description.substring(0, 150) + (description.length > 150 ? "..." : "") : "";
//   return {
//     title: `${brand} ${title}`,
//     description: cleanDescription,
//     keywords: [title, brand, slug, "buy online", "best price"].filter(Boolean).join(", "),
//   } 
  
// }


export async function POST(req: Request) {
  try {
    interface CustomSession extends Session {
      user: {
        id: string;
        role: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
      };
    }
    
    const session = await getServerSession(authOptions) as CustomSession;

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { details: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      discount,
      stock,
      sku,
      sizes,
      gender,
      brand,
      warranty,
      returnPolicy,
      shipping,
      categoryIds,
      images,
    } = body;

    // Basic validation
    if (!title || !sku || !images || images.length === 0) {
      return NextResponse.json(
        { details: 'Missing required fields: title, sku, images.' },
        { status: 400 }
      );
    }
    if(images.length >5)
    {
      return NextResponse.json(
        { details: 'Maximum 5 images allowed.' },
        { status: 400 }
      );
    }
    const metaTitle = `${title} | ${brand ?? "Shop"}`;
const metaDescription = description
  ? description.substring(0, 150) + (description.length > 150 ? "..." : "")
  : "";
const metaKeywords = [title, brand, "buy online", "best price"]
  .filter(Boolean)
  .join(", ");
    const slug = sku.toLowerCase().replace(/\s+/g, "-");
    // const metaTags = generateMetaTag(title, description, brand, slug);

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price,
        sku,
        gender,
        brand,
        userId: session.user.id, 
        stock: Number(stock),
        discountPercentage: Number(discount),
        warrantyInformation: warranty,
        returnPolicy,
        shippingInformation: shipping,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      metaKeywords: metaKeywords,
      slug: slug,

        category: {
          connect: categoryIds.map((id: string) => ({ id: id })),
        },

        sizes: {
          create: sizes.map((sizeValue: string) => ({
            size: sizeValue.toUpperCase(),
          })),
        },

        images: {
          createMany: {
            data: images.map((url: string) => ({ url })),
          },
        },
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { details: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
