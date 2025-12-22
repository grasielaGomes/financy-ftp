import { AppError } from '@/shared/errors/AppError'

/**
 * Converts a decimal currency amount (e.g. 10.50) to integer cents (e.g. 1050).
 * Uses rounding to avoid floating point artifacts.
 */
export const toCents = (amount: number): number => {
  if (!Number.isFinite(amount)) {
    throw new AppError('Invalid amount.', {
      code: 'BAD_REQUEST',
      httpStatus: 400,
    })
  }

  if (amount < 0) {
    throw new AppError('Amount must be non-negative.', {
      code: 'BAD_REQUEST',
      httpStatus: 400,
    })
  }

  const cents = Math.round(amount * 100)

  if (!Number.isSafeInteger(cents)) {
    throw new AppError('Amount is too large.', {
      code: 'BAD_REQUEST',
      httpStatus: 400,
    })
  }

  return cents
}

/**
 * Converts integer cents (e.g. 1050) to decimal currency amount (e.g. 10.5).
 */
export const fromCents = (cents: number): number => {
  if (!Number.isFinite(cents) || !Number.isInteger(cents)) {
    throw new AppError('Invalid amountCents.', {
      code: 'INTERNAL_ERROR',
      httpStatus: 500,
    })
  }

  return cents / 100
}
