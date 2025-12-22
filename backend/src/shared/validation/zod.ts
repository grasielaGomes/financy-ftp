import { z } from 'zod'
import { badRequest } from '@/shared/errors/errors'

type Issue = { path: string; message: string }

export const parseOrThrow = <T>(schema: z.ZodType<T>, input: unknown): T => {
  const parsed = schema.safeParse(input)

  if (parsed.success) return parsed.data

  const issues: Issue[] = parsed.error.issues.map((i) => ({
    path: i.path.join('.'),
    message: i.message,
  }))

  throw badRequest('Invalid input.', { issues })
}
