import type { Prisma } from '@prisma/client'
import type { prisma } from '@/prisma'

export type PrismaClientRoot = typeof prisma
export type PrismaClientTx = Prisma.TransactionClient

export type PrismaClientLike = PrismaClientRoot | PrismaClientTx
