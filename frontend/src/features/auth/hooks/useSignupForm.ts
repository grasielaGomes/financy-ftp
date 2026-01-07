import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { SIGN_UP_MUTATION } from '../auth.gql'
import type { SignUpInput, SignUpResult, SignUpVariables } from '../auth.types'

import { assertPresent } from '@/lib/assert'
import { setToken } from '@/lib/storage/token'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

const schema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  email: z.email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export type SignupFormValues = z.infer<typeof schema>

type UseSignupFormParams = {
  onSignedUp?: () => void
}

export const useSignupForm = ({ onSignedUp }: UseSignupFormParams = {}) => {
  const [showPassword, setShowPassword] = useState(false)

  const [signUp, { loading }] = useMutation<SignUpResult, SignUpVariables>(
    SIGN_UP_MUTATION
  )

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', password: '' },
  })

  const toggleShowPassword = () => setShowPassword((v) => !v)

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const { data } = await signUp({
        variables: {
          input: {
            email: values.email,
            password: values.password,
          } satisfies SignUpInput,
        },
      })

      const token = assertPresent(
        data?.signUp?.accessToken,
        'Token de acesso ausente na resposta do cadastro.'
      )

      setToken(token)
      showSuccessToast('Conta criada com sucesso.')
      onSignedUp?.()
    } catch (err) {
      showErrorToast(err, 'Não foi possível realizar o cadastro.')
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
