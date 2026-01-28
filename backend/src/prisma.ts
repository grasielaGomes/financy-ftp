import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { env } from '@/env'

declare global {
  var __prisma: PrismaClient | undefined
}

const createClient = () => {
  const adapter = new PrismaBetterSqlite3({
    url: env.DATABASE_URL,
  })

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['warn'] : ['error'],
  })
}

export const prisma = globalThis.__prisma ?? createClient()

if (env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
