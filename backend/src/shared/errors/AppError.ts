export type AppErrorOptions = {
  code: string
  httpStatus?: number
  details?: unknown
}

export class AppError extends Error {
  public readonly code: string
  public readonly httpStatus: number
  public readonly details?: unknown

  constructor(message: string, options: AppErrorOptions) {
    super(message)
    this.name = 'AppError'
    this.code = options.code
    this.httpStatus = options.httpStatus ?? 400
    this.details = options.details
  }
}
