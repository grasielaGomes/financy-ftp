import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { AppError } from '@/shared/errors/AppError'
import { signAccessToken } from '@/shared/auth/jwt'
import { normalizeEmail, assertPasswordStrength } from './auth.utils'
import type { PrismaClientLike } from '@/types/prisma'
import { isPrismaKnownRequestError } from '@/shared/errors/isPrismaKnownRequestError'

const signUpInputSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

const signInInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

const SALT_ROUNDS = 10

export const authService = {
  signUp: async (prisma: PrismaClientLike, input: unknown) => {
    const { email, password } = signUpInputSchema.parse(input)

    const normalizedEmail = normalizeEmail(email)
    assertPasswordStrength(password)

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    try {
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
        },
        select: { id: true, email: true },
      })

      const accessToken = signAccessToken(user.id)
      return { accessToken, user }
    } catch (err: unknown) {
      // Unique constraint failed (e.g. email already exists)
      if (isPrismaKnownRequestError(err) && err.code === 'P2002') {
        throw new AppError('Email is already in use.', {
          code: 'CONFLICT',
          httpStatus: 409,
        })
      }

      throw err
    }
  },

  signIn: async (prisma: PrismaClientLike, input: unknown) => {
    const { email, password } = signInInputSchema.parse(input)

    const normalizedEmail = normalizeEmail(email)

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, passwordHash: true },
    })

    if (!user) {
      throw new AppError('Invalid credentials.', {
        code: 'UNAUTHENTICATED',
        httpStatus: 401,
      })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      throw new AppError('Invalid credentials.', {
        code: 'UNAUTHENTICATED',
        httpStatus: 401,
      })
    }

    const accessToken = signAccessToken(user.id)

    return {
      accessToken,
      user: { id: user.id, email: user.email },
    }
  },

  me: async (prisma: PrismaClientLike, userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    })
  },
}
