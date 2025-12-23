import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { signAccessToken } from '@/shared/auth/jwt'
import type { PrismaClientLike } from '@/types/prisma'
import { isPrismaKnownRequestError } from '@/shared/errors/isPrismaKnownRequestError'
import { parseOrThrow } from '@/shared/validation/zod'
import { conflict, unauthenticated } from '@/shared/errors/errors'
import { normalizeEmail, assertPasswordStrength } from './auth.utils'

const signUpInputSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

const signInInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

const SALT_ROUNDS = 10

export const authService = {
  signUp: async (prisma: PrismaClientLike, input: unknown) => {
    const { email, password } = parseOrThrow(signUpInputSchema, input)

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
      if (isPrismaKnownRequestError(err) && err.code === 'P2002') {
        throw conflict('Email is already in use.')
      }

      throw err
    }
  },

  signIn: async (prisma: PrismaClientLike, input: unknown) => {
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

  me: async (prisma: PrismaClientLike, userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    })
  },
}
