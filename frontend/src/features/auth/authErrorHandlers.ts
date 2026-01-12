import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { getErrorCode, getErrorMessage } from '@/lib/graphql/error'
import { showErrorToast } from '@/lib/toast'

export const handleLoginError = <TFieldValues extends FieldValues>(
  err: unknown,
  form: UseFormReturn<TFieldValues>
) => {
  const code = getErrorCode(err)

  if (code === 'UNAUTHENTICATED') {
    const message = getErrorMessage(err)
    form.setError('email' as any, { message })
    form.setError('password' as any, { message })
    return
  }

  showErrorToast(err, 'Não foi possível realizar o login.')
}
