import { AppError } from '@/shared/errors/AppError'

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase()

export const assertPasswordStrength = (password: string) => {
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters.', {
      code: 'BAD_REQUEST',
      httpStatus: 400,
    })
  }
}
