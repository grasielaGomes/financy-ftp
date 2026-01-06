import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeClosed, UserRoundPlus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
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
} from '@/components/ui/Form'

import { SIGN_IN_MUTATION } from '../auth.gql'
import type { SignInResult, SignInVariables } from '../auth.types'

const schema = z.object({
  email: z.email('Enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
  remember: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

type LoginFormProps = {
  onSwitchToSignUp: () => void
  onLoggedIn?: () => void
}

export const LoginForm = ({ onSwitchToSignUp, onLoggedIn }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false)

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
          input: { email: values.email, password: values.password },
        },
      })

      const token = data?.signIn.accessToken
      if (!token) throw new Error('Missing token')

      setToken(token)
      toast.success('Logged in successfully.')
      onLoggedIn?.()
    } catch (err: any) {
      toast.error(err?.message ?? 'Unable to sign in.')
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
                  autoComplete="current-password"
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    showPassword ? <EyeClosed size={16} /> : <Eye size={16} />
                  }
                  rightIconAriaLabel={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  onRightIconClick={() => setShowPassword((v) => !v)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-3">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(Boolean(v))}
                />
                Lembrar-me
              </label>
            )}
          />

          <Button variant="link" size="link">
            Recuperar senha
          </Button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={loading}
        >
          Entrar
        </Button>

        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <span className="text-sm text-gray-500">ou</span>
          <Separator className="flex-1" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Ainda não tem uma conta?
        </p>

        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full"
          onClick={onSwitchToSignUp}
        >
          <UserRoundPlus size={18} />
          Criar conta
        </Button>
      </form>
    </Form>
  )
}
