import { useMutation } from '@apollo/client/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { setToken } from '@/lib/storage/token'

import { SIGN_IN_MUTATION } from '../auth.gql'
import type { SignInResult, SignInVariables } from '../auth.types'

const schema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
  remember: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

type LoginFormProps = {
  onSwitchToSignUp: () => void
  onLoggedIn?: () => void
}

export const LoginForm = ({ onSwitchToSignUp, onLoggedIn }: LoginFormProps) => {
  const [signIn, { loading }] = useMutation<SignInResult, SignInVariables>(
    SIGN_IN_MUTATION
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: true },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await signIn({
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
      })

      const token = data?.signIn.accessToken
      if (!token) throw new Error('Missing token')

      setToken(token)
      toast.success('Logged in successfully.')
      onLoggedIn?.()
    } catch (err: any) {
      // Keep it simple for now; later we can map extensions.code/details
      toast.error(err?.message ?? 'Unable to sign in.')
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
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
          autoComplete="current-password"
          {...form.register('password')}
        />
        {form.formState.errors.password?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={!!form.watch('remember')}
            onCheckedChange={(v) => form.setValue('remember', Boolean(v))}
          />
          Lembrar-me
        </label>

        <button
          type="button"
          className="text-sm text-primary underline-offset-4 hover:underline"
          onClick={() => toast.info('Recover password is not implemented yet.')}
        >
          Recuperar senha
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        Entrar
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">ou</span>
        <Separator className="flex-1" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{' '}
        <button
          type="button"
          className="text-primary underline-offset-4 hover:underline"
          onClick={onSwitchToSignUp}
        >
          Criar conta
        </button>
      </p>
    </form>
  )
}
