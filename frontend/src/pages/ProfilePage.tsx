import { useMemo } from 'react'
import { Mail, UserRound, LogOut } from 'lucide-react'
import { FormHeader, FormLayout } from '@/components/layout/FormLayout'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/Separator'
import { TextField } from '@/components/ui/TextField'
import { useMe } from '@/features/auth/hooks/useMe'
import { getInitials } from '@/utils/format'
import { useLogout } from '@/features/auth/hooks/useLogout'

export const ProfilePage = () => {
  const { user, loading } = useMe()
  const { logout } = useLogout({ showToast: true })

  const initials = useMemo(
    () => (loading ? '…' : getInitials(user?.fullName)),
    [loading, user?.fullName]
  )

  return (
    <FormLayout logo={null}>
      <FormHeader
        title={user?.fullName ?? 'Perfil'}
        subtitle={user?.email ?? ''}
      >
        <Avatar initials={initials} size="lg" className="mb-6" />
      </FormHeader>

      <Separator className="my-8" />

      <div className="flex flex-col gap-4">
        <TextField
          id="fullName"
          label="Nome completo"
          value={user?.fullName ?? ''}
          leftIcon={<UserRound size={16} />}
        />

        <TextField
          id="email"
          label="E-mail"
          value={user?.email ?? ''}
          readOnly
          leftIcon={<Mail size={16} />}
          hint="O e-mail não pode ser alterado"
          disabled
        />

        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full mt-2"
        >
          Salvar alterações
        </Button>

        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full"
          onClick={logout}
        >
          <LogOut size={18} color="var(--color-danger)" />
          Sair da conta
        </Button>
      </div>
    </FormLayout>
  )
}
