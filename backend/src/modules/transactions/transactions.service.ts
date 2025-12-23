import { z } from 'zod'

import type { PrismaClientLike } from '@/types/prisma'
import { parseOrThrow } from '@/shared/validation/zod'
import { badRequest, notFound } from '@/shared/errors/errors'
import { isPrismaKnownRequestError } from '@/shared/errors/isPrismaKnownRequestError'
import { toCents, fromCents } from '@/shared/utils/money'

const isoDateString = z
  .string()
  .datetime({ offset: true })
  .or(z.string().datetime({ offset: false }))
  .optional()

const createTransactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(80, 'Title is too long.'),
  amount: z.number().positive('Amount must be greater than 0.'),
  type: z.enum(['INCOME', 'EXPENSE']),
  occurredAt: isoDateString,
  categoryId: z.string().min(1).optional(),
})

const updateTransactionSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(80).optional(),
  amount: z.number().positive().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  occurredAt: isoDateString,
  categoryId: z.string().min(1).nullable().optional(),
})

const mapTransaction = (t: {
  id: string
  title: string
  amountCents: number
  type: 'INCOME' | 'EXPENSE'
  occurredAt: Date
  createdAt: Date
  updatedAt: Date
  category?: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
  } | null
}) => ({
  id: t.id,
  title: t.title,
  amount: fromCents(t.amountCents),
  type: t.type,
  occurredAt: t.occurredAt.toISOString(),
  createdAt: t.createdAt.toISOString(),
  updatedAt: t.updatedAt.toISOString(),
  category: t.category
    ? {
        id: t.category.id,
        name: t.category.name,
        createdAt: t.category.createdAt.toISOString(),
        updatedAt: t.category.updatedAt.toISOString(),
      }
    : null,
})

const ensureCategoryOwnership = async (
  prisma: PrismaClientLike,
  userId: string,
  categoryId: string
) => {
  const exists = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  })

  if (!exists) {
    throw badRequest('Invalid categoryId.')
  }
}

export const transactionsService = {
  list: async (prisma: PrismaClientLike, userId: string) => {
    const items = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      select: {
        id: true,
        title: true,
        amountCents: true,
        type: true,
        occurredAt: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true, createdAt: true, updatedAt: true },
        },
      },
    })

    return items.map(mapTransaction)
  },

  create: async (prisma: PrismaClientLike, userId: string, input: unknown) => {
    const { title, amount, type, occurredAt, categoryId } = parseOrThrow(
      createTransactionSchema,
      input
    )

    if (categoryId) {
      await ensureCategoryOwnership(prisma, userId, categoryId)
    }

    const created = await prisma.transaction.create({
      data: {
        title,
        amountCents: toCents(amount),
        type,
        occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
        userId,
        categoryId: categoryId ?? null,
      },
      select: {
        id: true,
        title: true,
        amountCents: true,
        type: true,
        occurredAt: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true, createdAt: true, updatedAt: true },
        },
      },
    })

    return mapTransaction(created)
  },

  update: async (prisma: PrismaClientLike, userId: string, input: unknown) => {
    const { id, title, amount, type, occurredAt, categoryId } = parseOrThrow(
      updateTransactionSchema,
      input
    )

    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
      select: { id: true },
    })

    if (!existing) throw notFound('Transaction not found.')

    if (typeof categoryId === 'string') {
      await ensureCategoryOwnership(prisma, userId, categoryId)
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(amount !== undefined ? { amountCents: toCents(amount) } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(occurredAt !== undefined
          ? { occurredAt: occurredAt ? new Date(occurredAt) : new Date() }
          : {}),
        ...(categoryId !== undefined ? { categoryId: categoryId ?? null } : {}),
      },
      select: {
        id: true,
        title: true,
        amountCents: true,
        type: true,
        occurredAt: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true, createdAt: true, updatedAt: true },
        },
      },
    })

    return mapTransaction(updated)
  },

  remove: async (
    prisma: PrismaClientLike,
    userId: string,
    idInput: unknown
  ) => {
    const schema = z.object({ id: z.string().min(1) })
    const { id } = parseOrThrow(schema, { id: idInput })

    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
      select: { id: true },
    })

    if (!existing) throw notFound('Transaction not found.')

    try {
      await prisma.transaction.delete({ where: { id } })
      return true
    } catch (err: unknown) {
      if (isPrismaKnownRequestError(err) && err.code === 'P2025') {
        throw notFound('Transaction not found.')
      }
      throw err
    }
  },
}
