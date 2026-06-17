import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    
    // Quick query to verify access
    const categoryCount = await prisma.category.count();
    console.log("Database Connection: SUCCESS");
    console.log(`Prisma Client Initialized. Current Categories: ${categoryCount}`);
  } catch (error) {
    console.error("Database Connection: FAILED");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
