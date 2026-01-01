import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Log connection info in production for debugging
if (process.env.NODE_ENV === 'production') {
  console.log('[Prisma] Initializing Prisma Client');
  console.log('[Prisma] POSTGRES_PRISMA_URL:', process.env.POSTGRES_PRISMA_URL ? 'Set' : 'NOT SET');
  console.log('[Prisma] POSTGRES_URL_NON_POOLING:', process.env.POSTGRES_URL_NON_POOLING ? 'Set' : 'NOT SET');
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

