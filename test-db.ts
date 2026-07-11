import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to connect to the database...');
    // A simple query to check the connection
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version();`;
    console.log('✅ Connection successful!');
    console.log('Database Details:', result);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
