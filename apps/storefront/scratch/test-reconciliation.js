const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'hj7545498@gmail.com';
  const newId = 'c8a8d875-8462-4948-b137-e742e529f358';

  const userBefore = await prisma.user.findFirst({ where: { email } });
  console.log("User before reconciliation:", JSON.stringify(userBefore, null, 2));

  if (userBefore && userBefore.id !== newId) {
    console.log(`Reconciling ID from ${userBefore.id} to ${newId}`);
    
    // Perform raw SQL update
    const result = await prisma.$executeRawUnsafe(
      `UPDATE "User" SET id = $1 WHERE id = $2`,
      newId,
      userBefore.id
    );
    console.log("Rows affected:", result);

    const userAfter = await prisma.user.findUnique({ where: { id: newId } });
    console.log("User after reconciliation:", JSON.stringify(userAfter, null, 2));
  } else {
    console.log("No reconciliation needed or user not found.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
