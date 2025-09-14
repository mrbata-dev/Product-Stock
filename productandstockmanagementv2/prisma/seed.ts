import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY! // service role for uploads
);

const categories = [
  { id: "cat_elec", title: "Electronics" },
  { id: "cat_cloth", title: "Clothing" },
  { id: "cat_books", title: "Books" },
  { id: "cat_home", title: "Home & Garden" },
  { id: "cat_sports", title: "Sports" },
];

const productTemplates = [
    {
      title: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation.',
      price: 99.99,
      discount: 10,
      stock: 50,
      brand: 'TechCorp',
      sku: 'TC-HP-001',
      warranty: '1 year warranty',
      shipping: 'Free shipping worldwide',
      returnPolicy: '30 days return policy',
      gender: null,
      metaTitle: 'Wireless Bluetooth Headphones',
      metaDesc: 'Shop high-quality wireless headphones with noise cancellation.',
      metaKeywords: 'headphones, bluetooth, wireless',
      slug: 'wireless-bluetooth-headphones',
      categoryIds: ['cat_elec'],
      images: [
        '/uploads/01.jpg',
       '/uploads/02.jpg',
       '/uploads/03.jpg',
      ],
      sizes: []
    },
    {
      title: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt for everyday wear.',
      price: 19.99,
      discount: 0,
      stock: 200,
      brand: 'FashionCo',
      sku: 'FC-TS-002',
      warranty: null,
      shipping: 'Standard shipping',
      returnPolicy: '14 days return policy',
      gender: 'Unisex',
      metaTitle: 'Cotton T-Shirt',
      metaDesc: 'Shop comfortable cotton t-shirts for men and women.',
      metaKeywords: 't-shirt, cotton, fashion',
      slug: 'cotton-t-shirt',
      categoryIds: ['cat_cloth'],
      images: [
        '/uploads/04.jpg',
        '/uploads/05.jpg',
        '/uploads/06.jpg',
        '/uploads/07.jpg',
      ],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      title: 'Stainless Steel Water Bottle',
      description: 'Durable water bottle with double-wall insulation.',
      price: 24.99,
      discount: 5,
      stock: 150,
      brand: 'HydroFlask',
      sku: 'HF-WB-003',
      warranty: 'Lifetime warranty',
      shipping: 'Free shipping on orders over $50',
      returnPolicy: '60 days return policy',
      gender: null,
      metaTitle: 'Stainless Steel Water Bottle',
      metaDesc: 'Buy durable stainless steel water bottles with insulation.',
      metaKeywords: 'water bottle, stainless steel, insulated',
      slug: 'stainless-steel-water-bottle',
      categoryIds: ['cat_home'],
      images: [
  '/uploads/09.jpg',
        '/uploads/10.gif',
      ],
      sizes: []
    },
    {
      title: 'Running Shoes',
      description: 'Lightweight running shoes for optimal performance.',
      price: 89.99,
      discount: 15,
      stock: 75,
      brand: 'SportMax',
      sku: 'SM-RS-004',
      warranty: '2 years warranty',
      shipping: 'Free shipping',
      returnPolicy: '30 days return policy',
      gender: 'Men',
      metaTitle: 'Running Shoes',
      metaDesc: 'Shop lightweight running shoes for men.',
      metaKeywords: 'running shoes, sport, athletic',
      slug: 'running-shoes',
      categoryIds: ['cat_sports'],
      images: [
        '/uploads/12.avif',
        '/uploads/13.avif',
        '/uploads/14.avif',
      ],
      sizes: ['7', '8', '9', '10', '11']
    },
    {
      title: 'Modern Recipes Cookbook',
      description: 'A collection of modern recipes for home cooking.',
      price: 29.99,
      discount: 20,
      stock: 300,
      brand: 'BookWorld',
      sku: 'BW-CB-005',
      warranty: null,
      shipping: 'Free shipping',
      returnPolicy: 'No returns accepted',
      gender: null,
      metaTitle: 'Modern Recipes Cookbook',
      metaDesc: 'Explore modern recipes for home cooking.',
      metaKeywords: 'cookbook, recipes, cooking',
      slug: 'modern-recipes-cookbook',
      categoryIds: ['cat_books'],
      images: [
       '/uploads/15.jpeg',
       '/uploads/16.jpeg',
      ],
      sizes: []
    },
    {
      title: 'Yoga Mat',
      description: 'Non-slip yoga mat for exercise and meditation.',
      price: 34.99,
      discount: 0,
      stock: 120,
      brand: 'FitLife',
      sku: 'FL-YM-006',
      warranty: '1 year warranty',
      shipping: 'Standard shipping',
      returnPolicy: '30 days return policy',
      gender: 'Unisex',
      metaTitle: 'Yoga Mat',
      metaDesc: 'Shop non-slip yoga mats for exercise and meditation.',
      metaKeywords: 'yoga mat, fitness, exercise',
      slug: 'non-slip-yoga-mat',
      categoryIds: ['cat_sports'],
      images: [
        '/uploads/17.avif',
      ],
      sizes: []
    },
    {
      title: 'Smart Watch',
      description: 'Advanced smartwatch with health monitoring features.',
      price: 199.99,
      discount: 10,
      stock: 80,
      brand: 'TechCorp',
      sku: 'TC-SW-007',
      warranty: '2 year warranty',
      shipping: 'Free shipping worldwide',
      returnPolicy: '45 days return policy',
      gender: null,
      metaTitle: 'Smart Watch',
      metaDesc: 'Advanced smartwatch with health monitoring features.',
      metaKeywords: 'smart watch, wearable tech, health monitor',
      slug: 'advanced-smart-watch',
      categoryIds: ['cat_elec'],
      images: [
        '/uploads/18.avif',
        '/uploads/19.avif',
        '/uploads/20.avif',
      ],
      sizes: []
    },
    {
      title: 'Denim Jeans',
      description: 'Classic blue denim jeans with stretch fabric.',
      price: 59.99,
      discount: 25,
      stock: 180,
      brand: 'FashionCo',
      sku: 'FC-DJ-008',
      warranty: null,
      shipping: 'Standard shipping',
      returnPolicy: '30 days return policy',
      gender: 'Women',
      metaTitle: 'Denim Jeans',
      metaDesc: 'Classic blue denim jeans with stretch fabric for women.',
      sizes: ['s', 'm', 'md', 'xl'],
      metaKeywords: 'denim jeans, women\'s fashion, casual wear',
      slug: 'classic-denim-jeans-women',
      categoryIds: ['cat_cloth'],
      images: [
       '/uploads/21.jpg',
      ],
  
    },
    {
      title: 'Garden Tool Set',
      description: 'Complete garden tool set for outdoor gardening.',
      price: 49.99,
      discount: 15,
      stock: 90,
      brand: 'HomePro',
      sku: 'HP-GT-009',
      warranty: '5 year warranty',
      shipping: 'Free shipping',
      returnPolicy: '60 days return policy',
      gender: null,
      metaTitle: 'Garden Tool Set',
      metaDesc: 'Complete garden tool set for outdoor gardening.',
      metaKeywords: 'garden tools, outdoor, gardening equipment',
      slug: 'complete-garden-tool-set',
      categoryIds: ['cat_home'],
      images: [
        'https://example.com/tools1.jpg',
        'https://example.com/tools2.jpg'
      ],
      sizes: []
    },
    {
      title: 'Fitness Tracker',
      description: 'Activity tracker with heart rate monitoring.',
      price: 79.99,
      discount: 5,
      stock: 110,
      brand: 'FitLife',
      sku: 'FL-FT-010',
      warranty: '1 year warranty',
      shipping: 'Standard shipping',
      returnPolicy: '30 days return policy',
      gender: 'Unisex',
      metaTitle: 'Fitness Tracker',
      metaDesc: 'Activity tracker with heart rate monitoring for everyone.',
      metaKeywords: 'fitness tracker, activity monitor, heart rate',
      slug: 'activity-fitness-tracker',
      categoryIds: ['cat_sports'],
      images: [
        'https://example.com/tracker1.jpg',
        'https://example.com/tracker2.jpg'
      ],
      sizes: []
    }
  ];

async function uploadImage(filePath: string, fileName: string) {
  // If remote URL → just return it
  if (filePath.startsWith("http")) return filePath;

  const fileBuffer = fs.readFileSync(path.join(__dirname, filePath));
  const { data, error } = await supabase.storage
    .from("products") // your bucket name
    .upload(`seed/${Date.now()}-${fileName}`, fileBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error("Image upload failed:", error);
    throw error;
  }

  const { data: publicUrl } = supabase.storage
    .from("products")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}

async function main() {
  // Insert categories first
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: { id: cat.id, title: cat.title },
    });
  }

  // Insert products
  for (const product of productTemplates) {
    const uploadedUrls = [];
    for (const [index, img] of product.images.entries()) {
      const url = await uploadImage(img, `${product.slug}-${index}`);
      uploadedUrls.push(url);
    }

    await prisma.product.create({
      data: {
        title: product.title,
        description: product.description,
        price: product.price,
        discountPercentage: product.discount,
        stock: product.stock,
        brand: product.brand,
        sku: product.sku,
        warrantyInformation: product.warranty,
        shippingInformation: product.shipping,
        returnPolicy: product.returnPolicy,
        gender: product.gender,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDesc,
        metaKeywords: product.metaKeywords,
        slug: product.slug,
        userId: "cmf99dy8n000aebfkntkiujdh",
        categories: {
          connect: product.categoryIds.map((id) => ({ id })),
        },
        images: {
          create: uploadedUrls.map((url) => ({ url })),
        },
        sizes: {
          create: product.sizes.map((size) => ({ size })),
        },
      },
    });
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
