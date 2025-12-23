import { z } from 'zod'

import type { PrismaClientLike } from '@/types/prisma'
import { parseOrThrow } from '@/shared/validation/zod'
import { conflict, notFound } from '@/shared/errors/errors'
import { isPrismaKnownRequestError } from '@/shared/errors/isPrismaKnownRequestError'

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(60, 'Name is too long.'),
})

const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(60, 'Name is too long.'),
})

const mapCategory = (c: {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}) => ({
  id: c.id,
  name: c.name,
  createdAt: c.createdAt.toISOString(),
  updatedAt: c.updatedAt.toISOString(),
})

export const categoriesService = {
  list: async (prisma: PrismaClientLike, userId: string) => {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    })

    return categories.map(mapCategory)
  },

  create: async (prisma: PrismaClientLike, userId: string, input: unknown) => {
    const { name } = parseOrThrow(createCategorySchema, input)

    try {
      const created = await prisma.category.create({
        data: { name, userId },
        select: { id: true, name: true, createdAt: true, updatedAt: true },
      })

      return mapCategory(created)
    } catch (err: unknown) {
      // @@unique([userId, name])
      if (isPrismaKnownRequestError(err) && err.code === 'P2002') {
        throw conflict('Category name already exists.')
      }
      throw err
    }
  },

  update: async (prisma: PrismaClientLike, userId: string, input: unknown) => {
    const { id, name } = parseOrThrow(updateCategorySchema, input)

    try {
      const updated = await prisma.category.update({
        where: { id },
        data: { name },
        select: {
          id: true,
          name: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      // Ownership guard (multi-tenant)
      if (updated.userId !== userId) {
        // We intentionally do not reveal existence across tenants
        throw notFound('Category not found.')
      }

      return mapCategory(updated)
    } catch (err: unknown) {
      if (isPrismaKnownRequestError(err)) {
        if (err.code === 'P2002') {
          throw conflict('Category name already exists.')
        }
        // Record not found (update/delete)
        if (err.code === 'P2025') {
          throw notFound('Category not found.')
        }
      }
      throw err
    }
  },

  remove: async (
    prisma: PrismaClientLike,
    userId: string,
    idInput: unknown
  ) => {
    const schema = z.object({ id: z.string().min(1) })
    const { id } = parseOrThrow(schema, { id: idInput })

    try {
      const deleted = await prisma.category.delete({
        where: { id },
        select: { id: true, userId: true },
      })

      if (deleted.userId !== userId) {
        throw notFound('Category not found.')
      }

      return true
    } catch (err: unknown) {
      if (isPrismaKnownRequestError(err) && err.code === 'P2025') {
        throw notFound('Category not found.')
      }
      throw err
    }
  },
}
