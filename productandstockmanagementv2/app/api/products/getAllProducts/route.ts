import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type SearchParams = {
  page?: string;
  limit?: string;
  category?: string;
  gender?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  discount?: string;
  stock?: string;
  sort?: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || undefined;
    const gender = searchParams.get("gender") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const minPrice = parseFloat(searchParams.get("minPrice") || "");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "");
    const discount = searchParams.get("discount");
    const inStock = searchParams.get("stock");
    const sort = searchParams.get("sort");

    // where conditions
    const whereConditions: any = {};

    if (category) {
      whereConditions.category = { some: { title: category } };
    }
    if (gender) {
      whereConditions.gender = gender;
    }
    if (brand) {
      whereConditions.brand = brand;
    }
    if (!isNaN(minPrice)) {
      whereConditions.price = { gte: minPrice };
    }
    if (!isNaN(maxPrice)) {
      whereConditions.price = {
        ...(whereConditions.price || {}),
        lte: maxPrice,
      };
    }
    if (discount) {
      whereConditions.discountPercentage = { gt: 0 };
    }
    if (inStock === "true") {
      whereConditions.stock = { gt: 0 };
    }

    // sorting
    let orderBy = {};
    switch (sort) {
      case "latest":
        orderBy = { createAt: "desc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { createAt: "desc" };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereConditions,
        orderBy,
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
          metaKeywords: true,
          sku:true,
          discountPercentage: true,
          images: {
            select:{
              id: true,
              url: true
            }
          },
          category: true,
          stock: true,
          createAt: true,
          updateAt: true,
        },
      }),
      prisma.product.count({
        where: whereConditions,
      }),
    ]);

    
    
    // After fetching products
const fixedProducts = products.map(product => ({
  ...product,
  images: product.images.map(img => ({
    ...img,
    url: img.url.replace('product-images', 'uploads'),
  })),
}));


    return NextResponse.json({
      products: fixedProducts,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
