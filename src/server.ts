import app from './app.js';
import prisma from './prisma.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`✓ Database connected`);
    console.log(`✓ Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Server closed');
    process.exit(0);
  });
});

