import { z } from 'zod'

import type { PrismaClientLike } from '@/types/prisma'
import { parseOrThrow } from '@/shared/validation/zod'
import { badRequest, notFound } from '@/shared/errors/errors'
import { isPrismaKnownRequestError } from '@/shared/errors/isPrismaKnownRequestError'
import { toCents, fromCents } from '@/shared/utils/money'
import { TRANSACTION_TYPES, TransactionType } from '@financy/contracts'

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/
const periodPattern = /^\d{4}-\d{2}$/

const dateOnlyString = z
  .string()
  .regex(dateOnlyPattern)
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    )
  }, 'Invalid date.')

const occurredAtInput = z
  .union([
    z.iso.datetime({ offset: true }),
    z.iso.datetime({ offset: false }),
    dateOnlyString,
  ])
  .optional()

const periodString = z
  .string()
  .regex(periodPattern)
  .refine((value) => {
    const [, month] = value.split('-').map(Number)
    return month >= 1 && month <= 12
  }, 'Invalid period.')

const parseOccurredAt = (value?: string) => {
  if (!value) return undefined

  if (dateOnlyPattern.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  }

  return new Date(value)
}

const parsePeriodRange = (value: string) => {
  const [year, month] = value.split('-').map(Number)
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0))
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0))
  return { start, end }
}

const listTransactionsSchema = z.object({
  search: z.string().trim().min(1).optional(),
  type: z.enum(TRANSACTION_TYPES).optional(),
  categoryId: z.string().min(1).optional(),
  period: periodString.optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).optional(),
})

const createTransactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(80, 'Title is too long.'),
  amount: z.number().positive('Amount must be greater than 0.'),
  type: z.enum(TRANSACTION_TYPES),
  occurredAt: occurredAtInput,
  categoryId: z.string().min(1).optional(),
})

const updateTransactionSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(80).optional(),
  amount: z.number().positive().optional(),
  type: z.enum(TRANSACTION_TYPES).optional(),
  occurredAt: occurredAtInput,
  categoryId: z.string().min(1).nullable().optional(),
})

const mapTransaction = (t: {
  id: string
  title: string
  amountCents: number
  type: TransactionType
  occurredAt: Date
  createdAt: Date
  updatedAt: Date
  category?: {
    id: string
    name: string
    description: string | null
    iconKey: string
    colorKey: string
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
        description: t.category.description,
        iconKey: t.category.iconKey,
        colorKey: t.category.colorKey,
        createdAt: t.category.createdAt.toISOString(),
        updatedAt: t.category.updatedAt.toISOString(),
      }
    : null,
})

const ensureCategoryOwnership = async (
  prisma: PrismaClientLike,
  userId: string,
  categoryId: string,
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
  list: async (prisma: PrismaClientLike, userId: string, input?: unknown) => {
    const {
      search,
      type,
      categoryId,
      period,
      page = 1,
      perPage = 10,
    } = parseOrThrow(listTransactionsSchema, input ?? {})

    const normalizedCategoryId = categoryId === 'all' ? undefined : categoryId

    const where: {
      userId: string
      type?: TransactionType
      categoryId?: string
      title?: { contains: string; mode: 'insensitive' }
      occurredAt?: { gte: Date; lt: Date }
    } = { userId }

    if (type) where.type = type
    if (normalizedCategoryId) where.categoryId = normalizedCategoryId
    if (search) where.title = { contains: search, mode: 'insensitive' }

    if (period) {
      const { start, end } = parsePeriodRange(period)
      where.occurredAt = { gte: start, lt: end }
    }

    const [total, items] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { occurredAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          title: true,
          amountCents: true,
          type: true,
          occurredAt: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              iconKey: true,
              colorKey: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      }),
    ])

    return { items: items.map(mapTransaction), total }
  },

  listPeriods: async (prisma: PrismaClientLike, userId: string) => {
    const rows = await prisma.$queryRaw<
      Array<{ period: string; count: number }>
    >`
      SELECT
        strftime('%Y-%m', occurredAt) as period,
        COUNT(*) as count
      FROM "Transaction"
      WHERE userId = ${userId}
      GROUP BY period
      ORDER BY period DESC
    `

    return rows.map((r) => ({
      period: String(r.period),
      count: Number(r.count),
    }))
  },

  create: async (prisma: PrismaClientLike, userId: string, input: unknown) => {
    const { title, amount, type, occurredAt, categoryId } = parseOrThrow(
      createTransactionSchema,
      input,
    )

    if (categoryId) {
      await ensureCategoryOwnership(prisma, userId, categoryId)
    }

    const parsedOccurredAt = occurredAt
      ? parseOccurredAt(occurredAt)
      : undefined

    const created = await prisma.transaction.create({
      data: {
        title,
        amountCents: toCents(amount),
        type,
        occurredAt: parsedOccurredAt ?? new Date(),
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
          select: {
            id: true,
            name: true,
            description: true,
            iconKey: true,
            colorKey: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    return mapTransaction(created)
  },

  update: async (prisma: PrismaClientLike, userId: string, input: unknown) => {
    const { id, title, amount, type, occurredAt, categoryId } = parseOrThrow(
      updateTransactionSchema,
      input,
    )

    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
      select: { id: true },
    })

    if (!existing) throw notFound('Transaction not found.')

    if (typeof categoryId === 'string') {
      await ensureCategoryOwnership(prisma, userId, categoryId)
    }

    const parsedOccurredAt =
      occurredAt !== undefined ? parseOccurredAt(occurredAt) : undefined

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(amount !== undefined ? { amountCents: toCents(amount) } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(occurredAt !== undefined
          ? { occurredAt: parsedOccurredAt ?? new Date() }
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
          select: {
            id: true,
            name: true,
            description: true,
            iconKey: true,
            colorKey: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    return mapTransaction(updated)
  },

  remove: async (
    prisma: PrismaClientLike,
    userId: string,
    idInput: unknown,
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
