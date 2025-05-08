import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Verifying users in the database...");

  // Count all users
  const userCount = await prisma.user.count();
  console.log(`Total users in database: ${userCount}`);

  // Get a sample of users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      Profile: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
    take: 5,
  });

  console.log("\nSample users (with hashed passwords):");
  users.forEach((user) => {
    console.log(`ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
    console.log(`Name: ${user.Profile?.firstname} ${user.Profile?.lastname}`);
    console.log(`Password hash: ${user.password.substring(0, 20)}...`);
    console.log("-".repeat(50));
  });
}

main()
  .catch((e) => {
    console.error("Error verifying users:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
