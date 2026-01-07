import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { SIGN_IN_MUTATION } from '../auth.gql'
import type { SignInResult, SignInVariables } from '../auth.types'

import { assertPresent } from '@/lib/assert'
import { setToken } from '@/lib/storage/token'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

const schema = z.object({
  email: z.email('Enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
  remember: z.boolean().optional(),
})

export type LoginFormValues = z.infer<typeof schema>

type UseLoginFormParams = {
  onLoggedIn?: () => void
}

export const useLoginForm = ({ onLoggedIn }: UseLoginFormParams = {}) => {
  const [showPassword, setShowPassword] = useState(false)

  const [signIn, { loading }] = useMutation<SignInResult, SignInVariables>(
    SIGN_IN_MUTATION
  )

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: true },
  })

  const toggleShowPassword = () => setShowPassword((v) => !v)

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { data } = await signIn({
        variables: {
          input: { email: values.email, password: values.password },
        },
      })

      const token = assertPresent(
        data?.signIn?.accessToken,
        'Token de acesso ausente na resposta do login.'
      )

      setToken(token)
      showSuccessToast('Login realizado com sucesso.')
      onLoggedIn?.()
    } catch (err) {
      showErrorToast(err, 'Não foi possível realizar o login.')
    }
  }

  return {
    form,
    loading,
    showPassword,
    toggleShowPassword,
    onSubmit,
  }
}
