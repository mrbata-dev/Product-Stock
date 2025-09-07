
import { PrismaClient } from '../generated/prisma/index.js'; 

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.dbTest.create({
    data: {
      name: "Test User",
      
    },
  });
  console.log("Seeded user:", user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });