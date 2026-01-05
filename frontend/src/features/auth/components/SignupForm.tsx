import { useMutation } from '@apollo/client/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { setToken } from '@/lib/storage/token'

import { SIGN_UP_MUTATION } from '../auth.gql'
import type { SignUpInput, SignUpResult, SignUpVariables } from '../auth.types'

const schema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  email: z.string().email('Enter a valid email.'),
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
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          placeholder="Seu nome completo"
          autoComplete="name"
          {...form.register('fullName')}
        />
        {form.formState.errors.fullName?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.fullName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          placeholder="mail@exemplo.com"
          autoComplete="email"
          {...form.register('email')}
        />
        {form.formState.errors.email?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          autoComplete="new-password"
          {...form.register('password')}
        />
        <p className="text-xs text-muted-foreground">
          A senha deve ter no mínimo 8 caracteres
        </p>
        {form.formState.errors.password?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        Cadastrar
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">ou</span>
        <Separator className="flex-1" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <button
          type="button"
          className="text-primary underline-offset-4 hover:underline"
          onClick={onSwitchToLogin}
        >
          Fazer login
        </button>
      </p>
    </form>
  )
}
