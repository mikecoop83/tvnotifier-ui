import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Warm the connection once during startup so the first request doesn't pay the connect cost.
await prisma.$connect();
