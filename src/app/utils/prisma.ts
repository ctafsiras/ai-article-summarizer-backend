import { PrismaClient } from '@prisma/client';

// globalForPrisma is used to store the PrismaClient instance in the global scope
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
