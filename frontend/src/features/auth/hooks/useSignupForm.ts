import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { SIGN_UP_MUTATION } from '../auth.gql'
import type { SignUpInput, SignUpResult, SignUpVariables } from '../auth.types'

import { assertPresent } from '@/lib/assert'
import { setToken } from '@/lib/storage/token'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { getErrorCode } from '@/lib/graphql/error'

const schema = z.object({
  fullName: z.string().trim().min(1, 'Nome completo é obrigatório.'),
  email: z.email('Digite um e-mail válido.'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
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

  const navigate = useNavigate()

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const { data } = await signUp({
        variables: {
          input: {
            fullName: values.fullName,
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
      form.reset()
      setShowPassword(false)

      navigate('/dashboard', { replace: true })
      onSignedUp?.()
    } catch (err) {
      const code = getErrorCode(err)

      if (code === 'CONFLICT') {
        form.setError('email', { message: 'Este e-mail já está em uso.' })
        return
      }

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
