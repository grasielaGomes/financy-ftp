type PrismaKnownRequestError = {
  code: string
}

export const isPrismaKnownRequestError = (
  err: unknown
): err is PrismaKnownRequestError => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as any).code === 'string'
  )
}
