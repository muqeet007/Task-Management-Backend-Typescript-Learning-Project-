import prisma from '../src/prisma.js';

async function main() {
  // Seed your database here
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      tasks: {
        create: [
          {
            title: 'Setup project',
            description: 'Initialize the TMS project',
            completed: true,
          },
          {
            title: 'Add models',
            description: 'Define User and Task models',
            completed: false,
          },
        ],
      },
    },
  });

  console.log('Seeding completed.', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });