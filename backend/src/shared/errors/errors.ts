import { AppError } from './AppError'
import { ErrorCode } from './errorCodes'

export const badRequest = (message: string, details?: unknown) =>
  new AppError(message, {
    code: ErrorCode.BAD_REQUEST,
    httpStatus: 400,
    details,
  })

export const unauthenticated = (message = 'Authentication required.') =>
  new AppError(message, { code: ErrorCode.UNAUTHENTICATED, httpStatus: 401 })

export const forbidden = (message = 'Not allowed.') =>
  new AppError(message, { code: ErrorCode.FORBIDDEN, httpStatus: 403 })

export const notFound = (message = 'Not found.') =>
  new AppError(message, { code: ErrorCode.NOT_FOUND, httpStatus: 404 })

export const conflict = (message: string, details?: unknown) =>
  new AppError(message, { code: ErrorCode.CONFLICT, httpStatus: 409, details })
