import { z } from 'zod'

import type { PrismaClientLike } from '@/types/prisma'
import { parseOrThrow } from '@/shared/validation/zod'
import { fromCents } from '@/shared/utils/money'
import { TRANSACTION_TYPES, type TransactionType } from '@financy/contracts'

const periodPattern = /^\d{4}-\d{2}$/

const periodString = z
  .string()
  .regex(periodPattern)
  .refine((value) => {
    const [, month] = value.split('-').map(Number)
    return month >= 1 && month <= 12
  }, 'Invalid period.')

const inputSchema = z.object({
  period: periodString.optional(),
  recentLimit: z.number().int().min(1).max(50).optional(),
})

const toYYYYMM = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const parsePeriodRange = (value: string) => {
  const [year, month] = value.split('-').map(Number)
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0))
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0))
  return { start, end }
}

const signedCents = (type: TransactionType, cents: number) => {
  return type === 'INCOME' ? cents : -cents
}

export const dashboardService = {
  getSummary: async (
    prisma: PrismaClientLike,
    userId: string,
    input?: unknown,
  ) => {
    const { period, recentLimit = 5 } = parseOrThrow(inputSchema, input ?? {})

    const resolvedPeriod =
      period && period.trim() !== '' ? period.trim() : toYYYYMM(new Date())

    const { start, end } = parsePeriodRange(resolvedPeriod)

    // 1) Balance total (all-time): income - expense
    const [incomeAll, expenseAll] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: 'INCOME' satisfies TransactionType },
        _sum: { amountCents: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE' satisfies TransactionType },
        _sum: { amountCents: true },
      }),
    ])

    const incomeAllCents = Number(incomeAll._sum.amountCents ?? 0)
    const expenseAllCents = Number(expenseAll._sum.amountCents ?? 0)
    const balanceTotalCents = incomeAllCents - expenseAllCents

    // 2) Month totals (period): sum by type
    const [incomeMonth, expenseMonth] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'INCOME' satisfies TransactionType,
          occurredAt: { gte: start, lt: end },
        },
        _sum: { amountCents: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE' satisfies TransactionType,
          occurredAt: { gte: start, lt: end },
        },
        _sum: { amountCents: true },
      }),
    ])

    const incomeMonthCents = Number(incomeMonth._sum.amountCents ?? 0)
    const expenseMonthCents = Number(expenseMonth._sum.amountCents ?? 0)

    // 3) Recent transactions (all-time)
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      take: recentLimit,
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

    const recentTransactionsUI = recentTransactions.map((t) => ({
      id: t.id,
      title: t.title,
      amount: fromCents(t.amountCents),
      type: t.type as TransactionType,
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
    }))

    // 4) Categories summary (period) with totals
    const grouped = await prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: {
        userId,
        occurredAt: { gte: start, lt: end },
        categoryId: { not: null },
        type: { in: [...TRANSACTION_TYPES] },
      },
      _count: { _all: true },
      _sum: { amountCents: true },
    })

    const categoryIds = Array.from(
      new Set(grouped.map((g) => g.categoryId).filter(Boolean) as string[]),
    )

    const categories = await prisma.category.findMany({
      where: { userId, id: { in: categoryIds } },
      select: {
        id: true,
        name: true,
        description: true,
        iconKey: true,
        colorKey: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const categoryMap = new Map(categories.map((c) => [c.id, c]))

    const summaryMap = new Map<
      string,
      { incomeCents: number; expenseCents: number; count: number }
    >()

    for (const row of grouped) {
      const categoryId = row.categoryId
      if (!categoryId) continue

      const current = summaryMap.get(categoryId) ?? {
        incomeCents: 0,
        expenseCents: 0,
        count: 0,
      }

      const sumCents = Number(row._sum.amountCents ?? 0)
      const count = Number(row._count._all ?? 0)

      current.count += count

      if (row.type === 'INCOME') current.incomeCents += sumCents
      if (row.type === 'EXPENSE') current.expenseCents += sumCents

      summaryMap.set(categoryId, current)
    }

    const categoriesSummary = Array.from(summaryMap.entries())
      .map(([categoryId, s]) => {
        const c = categoryMap.get(categoryId)
        if (!c) return null

        const income = fromCents(s.incomeCents)
        const expense = fromCents(s.expenseCents)
        const net = fromCents(
          signedCents('INCOME', s.incomeCents) +
            signedCents('EXPENSE', s.expenseCents),
        )

        return {
          category: {
            id: c.id,
            name: c.name,
            description: c.description,
            iconKey: c.iconKey,
            colorKey: c.colorKey,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
            transactionsCount: 0,
          },
          transactionsCount: s.count,
          total: net,
          income,
          expense,
        }
      })
      .filter(Boolean) as Array<{
      category: {
        id: string
        name: string
        description: string | null
        iconKey: string
        colorKey: string
        createdAt: string
        updatedAt: string
        transactionsCount: number
      }
      transactionsCount: number
      total: number
      income: number
      expense: number
    }>

    categoriesSummary.sort((a, b) => b.expense - a.expense)

    return {
      period: resolvedPeriod,
      balanceTotal: fromCents(balanceTotalCents),
      monthIncome: fromCents(incomeMonthCents),
      monthExpense: fromCents(expenseMonthCents),
      recentTransactions: recentTransactionsUI,
      categories: categoriesSummary,
    }
  },
}
