// src/lib/product.ts

import { prisma } from "./prisma";


export async function createProduct() {
  const product = await prisma.product.create({
    data: {
      title: "Nike Air Max",
      description: "Comfortable running shoes",
      price: 120.0,
      discountPercentage: 10,
      brand: "Nike",
      sku: "NIKE-12345",
      warrantyInformation: "1 year warranty",
      shippingInformation: "Free shipping worldwide",
      returnPolicy: "30-day return policy",
      slug: "nike-air-max",

      // link product to a user (must exist already)
      user: {
        connect: { id: "user-id-here" },
      },

      // add categories
      category: {
        connect: [{ id: "category-id-here" }], // you can connect multiple
      },

      // add stock
      stock: {
        create: [
          { quantity: 50 },
        ],
      },

      // add images
      images: {
        create: [
          { url: "https://example.com/img1.jpg" },
          { url: "https://example.com/img2.jpg" },
        ],
      },

      // add sizes
      sizes: {
        create: [
          { size: "M" },
          { size: "L" },
        ],
      },
    },
    include: {
      stock: true,
      images: true,
      sizes: true,
      category: true,
      user: true,
    },
  });

  return product;
}
