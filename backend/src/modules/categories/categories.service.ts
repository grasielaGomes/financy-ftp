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
    .max(60, 'Name is too long.'),
  description: z.string().trim().max(120).optional(),
  iconKey: z.enum(CATEGORY_ICON_KEYS, { message: 'Invalid icon.' }),
  colorKey: z.enum(CATEGORY_COLOR_KEYS, { message: 'Invalid color.' }),
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
}) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  iconKey: category.iconKey,
  colorKey: category.colorKey,
  createdAt: category.createdAt.toISOString(),
  updatedAt: category.updatedAt.toISOString(),
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
    const { id, name, iconKey, colorKey } = parseOrThrow(
      updateCategorySchema,
      input,
    )
    const normalizedTitle = normalizeTitle(name)

    try {
      const result = await prisma.category.updateMany({
        where: { id, userId }, // multi-tenant enforced here
        data: { name, normalizedTitle, iconKey, colorKey },
      })

      if (result.count === 0) {
        throw notFound('Category not found.')
      }

      const updated = await prisma.category.findUnique({
        where: { id },
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

      if (!updated) throw notFound('Category not found.')

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
