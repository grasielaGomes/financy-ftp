import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, UserRound, Lock, Eye, EyeClosed, LogIn } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/Separator'
import { InputWithIcon } from '@/components/ui/InputWithIcon'
import { setToken } from '@/lib/storage/token'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/Form'

import { SIGN_UP_MUTATION } from '../auth.gql'
import type { SignUpInput, SignUpResult, SignUpVariables } from '../auth.types'

const schema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  email: z.email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

type FormValues = z.infer<typeof schema>

type SignupFormProps = {
  onSwitchToLogin: () => void
  onSignedUp?: () => void
}

export const SignupForm = ({
  onSwitchToLogin,
  onSignedUp,
}: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const [signUp, { loading }] = useMutation<SignUpResult, SignUpVariables>(
    SIGN_UP_MUTATION
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', password: '' },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await signUp({
        variables: {
          input: {
            email: values.email,
            password: values.password,
          } satisfies SignUpInput,
        },
      })

      const token = data?.signUp.accessToken
      if (!token) throw new Error('Missing token')

      setToken(token)
      toast.success('Account created.')
      onSignedUp?.()
    } catch (err: any) {
      toast.error(err?.message ?? 'Unable to sign up.')
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <InputWithIcon
                  {...field}
                  id={field.name}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  leftIcon={<UserRound size={16} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <InputWithIcon
                  {...field}
                  id={field.name}
                  placeholder="mail@exemplo.com"
                  autoComplete="email"
                  leftIcon={<Mail size={16} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <InputWithIcon
                  {...field}
                  id={field.name}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  autoComplete="new-password"
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    showPassword ? <Eye size={16} /> : <EyeClosed size={16} />
                  }
                  rightIconAriaLabel={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  onRightIconClick={() => setShowPassword((v) => !v)}
                />
              </FormControl>

              <FormDescription>
                A senha deve ter no mínimo 8 caracteres
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          disabled={loading}
        >
          Cadastrar
        </Button>

        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <span className="text-sm text-gray-500">ou</span>
          <Separator className="flex-1" />
        </div>

        <p className="text-center text-sm text-gray-600">Já tem uma conta?</p>

        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full"
          onClick={onSwitchToLogin}
        >
          <LogIn size={18} />
          Fazer login
        </Button>
      </form>
    </Form>
  )
}
