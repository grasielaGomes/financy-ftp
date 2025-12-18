import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '@/env'

const tokenPayloadSchema = z.object({
  subject: z.string().min(1),
})

export type JwtUser = {
  userId: string
}

export const signAccessToken = (userId: string) => {
  // Using JWT "subject" keeps payload minimal and standard
  return jwt.sign({ subject: userId }, env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export const verifyAccessToken = (token: string): JwtUser => {
  const decoded = jwt.verify(token, env.JWT_SECRET)
  const parsed = tokenPayloadSchema.safeParse(decoded)

  if (!parsed.success) {
    throw new Error('Invalid token payload')
  }

  return { userId: parsed.data.subject }
}
