const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT 
      trigger_name, 
      event_manipulation, 
      event_object_table, 
      action_statement 
    FROM information_schema.triggers;
  `;
  console.log("TRIGGERS IN DATABASE:");
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
