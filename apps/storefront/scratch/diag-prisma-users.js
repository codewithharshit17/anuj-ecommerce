const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true }
  });
  console.log("=== ALL PRISMA USERS ===");
  users.forEach(u => {
    console.log(`  ID: ${u.id}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Name: ${u.firstName} ${u.lastName}`);
    console.log(`  Role: ${u.role}`);
    console.log('  ---');
  });
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
