import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { signAccessToken } from '@/shared/auth/jwt'
import type { PrismaClientRoot } from '@/types/prisma'
import { isPrismaKnownRequestError } from '@/shared/errors/isPrismaKnownRequestError'
import { parseOrThrow } from '@/shared/validation/zod'
import { badRequest, conflict, unauthenticated } from '@/shared/errors/errors'
import { categoryBootstrap } from '@/modules/categories/categoryBootstrap'
import { normalizeEmail, assertPasswordStrength } from './auth.utils'

const signUpInputSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  fullName: z.string().trim().min(1, 'Full name is required.'),
})

const signInInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

const updateProfileInputSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
})

const SALT_ROUNDS = 10

export const authService = {
  signUp: async (prisma: PrismaClientRoot, input: unknown) => {
    const { email, password, fullName } = parseOrThrow(signUpInputSchema, input)

    const normalizedEmail = normalizeEmail(email)
    assertPasswordStrength(password)

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    try {
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: normalizedEmail,
            passwordHash,
            fullName,
          },
          select: { id: true, email: true, fullName: true },
        })

        await categoryBootstrap(tx, user.id)

        const accessToken = signAccessToken(user.id)
        return { accessToken, user }
      })

      return result
    } catch (err: unknown) {
      if (isPrismaKnownRequestError(err) && err.code === 'P2002') {
        throw conflict('Email is already in use.')
      }
      throw err
    }
  },

  signIn: async (prisma: PrismaClientRoot, input: unknown) => {
    const { email, password } = parseOrThrow(signInInputSchema, input)

    const normalizedEmail = normalizeEmail(email)

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, passwordHash: true },
    })

    if (!user) throw unauthenticated('Invalid credentials.')

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) throw unauthenticated('Invalid credentials.')

    const accessToken = signAccessToken(user.id)

    return {
      accessToken,
      user: { id: user.id, email: user.email },
    }
  },

  updateProfile: async (
    prisma: PrismaClientRoot,
    userId: string,
    input: unknown,
  ) => {
    const parsed = updateProfileInputSchema.safeParse(input)
    if (!parsed.success) {
      throw badRequest('Invalid input.')
    }

    const { fullName } = parsed.data

    const user = await prisma.user
      .update({
        where: { id: userId },
        data: { fullName },
        select: { id: true, email: true, fullName: true },
      })
      .catch(() => null)

    if (!user) throw unauthenticated('Invalid credentials.')

    return user
  },

  me: async (prisma: PrismaClientRoot, userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true },
    })
  },
}
