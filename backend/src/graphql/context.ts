import type { FastifyReply, FastifyRequest } from 'fastify'
import type { YogaInitialContext } from 'graphql-yoga'
import { prisma } from '@/prisma'
import { verifyAccessToken } from '@/shared/auth/jwt'

export type GraphQLContext = YogaInitialContext & {
  req: FastifyRequest
  reply: FastifyReply
  prisma: typeof prisma
  userId: string | null
}

const getBearerToken = (authHeader: string | null): string | null => {
  if (!authHeader) return null
  const [type, token] = authHeader.split(' ')
  if (type !== 'Bearer' || !token) return null
  return token
}

export const buildContext = async (
  initial: YogaInitialContext & { req: FastifyRequest; reply: FastifyReply }
): Promise<GraphQLContext> => {
  const authHeader = initial.request.headers.get('authorization')
  const token = getBearerToken(authHeader)

  let userId: string | null = null

  if (token) {
    try {
      userId = verifyAccessToken(token).userId
    } catch {
      // If the token is invalid/expired, we keep userId null.
      // Resolvers that require auth will enforce it via `requireUser`.
      userId = null
    }
  }

  return {
    ...initial,
    prisma,
    userId,
  }
}
