import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function handleProductSale(productId, quantitySold) {
  try {
    // 1. Decrease the product stock
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantitySold,
        },
      },
    });

    // 2. Check the new stock level
    if (updatedProduct.stock <= 5 && updatedProduct.stock >= 0) {
      console.log(`Low stock alert: ${updatedProduct.title} is at ${updatedProduct.stock} units.`);

      // 3. Create a new notification record in the database
      const notification = await prisma.notification.create({
        data: {
          message: `Stock for ${updatedProduct.title} is critically low at ${updatedProduct.stock} units.`,
          productId: updatedProduct.id,
        },
      });

      // You can also send an email or a real-time notification to the admin here.
      // e.g., sendEmailToAdmin('Low Stock', notification.message);
    }
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product stock:', error);
  }
}

// Example usage:
// A customer buys 10 units of a product
// handleProductSale('some-product-id', 10);