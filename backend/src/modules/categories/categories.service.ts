import { z } from 'zod'

import type { PrismaClientLike } from '@/types/prisma'
import { parseOrThrow } from '@/shared/validation/zod'
import { conflict, notFound } from '@/shared/errors/errors'
import { isPrismaKnownRequestError } from '@/shared/errors/isPrismaKnownRequestError'
import { CATEGORY_COLOR_KEYS, CATEGORY_ICON_KEYS } from '@financy/contracts'
import { normalizeTitle } from '@/shared/utils/normalizeTitle'

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(60, 'Name is too long.'),
  description: z.string().trim().max(120).optional(),
  iconKey: z.enum(CATEGORY_ICON_KEYS, { message: 'Invalid icon.' }),
  colorKey: z.enum(CATEGORY_COLOR_KEYS, { message: 'Invalid color.' }),
})

const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(60, 'Name is too long.')
    .optional(),
  description: z.string().trim().max(120).optional(),
  iconKey: z.enum(CATEGORY_ICON_KEYS, { message: 'Invalid icon.' }).optional(),
  colorKey: z
    .enum(CATEGORY_COLOR_KEYS, { message: 'Invalid color.' })
    .optional(),
})

const removeCategorySchema = z.object({ id: z.string().min(1) })

const mapCategory = (category: {
  id: string
  name: string
  description: string | null
  iconKey: string
  colorKey: string
  createdAt: Date
  updatedAt: Date
  _count?: {
    transactions: number
  }
}) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  iconKey: category.iconKey,
  colorKey: category.colorKey,
  createdAt: category.createdAt.toISOString(),
  updatedAt: category.updatedAt.toISOString(),
  transactionsCount: category._count?.transactions ?? 0,
})

export const categoriesService = {
  list: async (prisma: PrismaClientLike, userId: string) => {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        iconKey: true,
        colorKey: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    })

    return categories.map(mapCategory)
  },

  create: async (prisma: PrismaClientLike, userId: string, input: unknown) => {
    const { name, description, iconKey, colorKey } = parseOrThrow(
      createCategorySchema,
      input,
    )
    const normalizedTitle = normalizeTitle(name)

    try {
      const created = await prisma.category.create({
        data: {
          name,
          normalizedTitle,
          description: description?.trim() || null,
          iconKey,
          colorKey,
          userId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          iconKey: true,
          colorKey: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              transactions: true,
            },
          },
        },
      })

      return mapCategory(created)
    } catch (err: unknown) {
      if (isPrismaKnownRequestError(err) && err.code === 'P2002') {
        throw conflict('Category name already exists.')
      }
      throw err
    }
  },

  update: async (prisma: PrismaClientLike, userId: string, input: unknown) => {
    const { id, name, description, iconKey, colorKey } = parseOrThrow(
      updateCategorySchema,
      input,
    )

    const current = await prisma.category.findFirst({
      where: { id, userId },
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

    if (!current) throw notFound('Category not found.')

    const data: Record<string, unknown> = {}

    if (name !== undefined) {
      const normalizedTitle = normalizeTitle(name)
      data.name = name
      data.normalizedTitle = normalizedTitle
    }

    if (iconKey !== undefined) data.iconKey = iconKey
    if (colorKey !== undefined) data.colorKey = colorKey

    if (description !== undefined) {
      data.description = description.trim() === '' ? null : description
    }

    if (Object.keys(data).length === 0) {
      return mapCategory(current)
    }

    try {
      const updated = await prisma.category.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          iconKey: true,
          colorKey: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              transactions: true,
            },
          },
        },
      })

      return mapCategory(updated)
    } catch (err: unknown) {
      if (isPrismaKnownRequestError(err) && err.code === 'P2002') {
        throw conflict('Category name already exists.')
      }
      throw err
    }
  },

  remove: async (
    prisma: PrismaClientLike,
    userId: string,
    idInput: unknown,
  ) => {
    const { id } = parseOrThrow(removeCategorySchema, { id: idInput })

    try {
      const result = await prisma.category.deleteMany({
        where: { id, userId },
      })

      if (result.count === 0) {
        throw notFound('Category not found.')
      }

      return true
    } catch (err: unknown) {
      throw err
    }
  },
}
