import { useMemo } from 'react'
import { Mail, UserRound, LogOut } from 'lucide-react'
import { FormHeader, FormLayout } from '@/components/layout/FormLayout'
import { Avatar } from '@/components/ui/Avatar'
import { InputWithIcon } from '@/components/ui/InputWithIcon'
import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/Separator'
import { useMe } from '@/features/auth/hooks/useMe'
import { getInitials } from '@/utils/format'
import { useLogout } from '@/features/auth/hooks/useLogout'

export const ProfilePage = () => {
  const { user, loading } = useMe()
  const { logout } = useLogout({ showToast: true })

  const initials = useMemo(() => {
    if (loading) return '…'
    return getInitials(user?.fullName)
  }, [loading, user?.fullName])

  return (
    <FormLayout logo={null}>
      <FormHeader
        title={user?.fullName ?? 'Perfil'}
        subtitle={user?.email ?? ''}
      >
        <Avatar initials={initials} size="lg" />
      </FormHeader>

      <Separator className="my-6" />

      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <span className="text-sm font-medium text-gray-700">
            Nome completo
          </span>
          <InputWithIcon
            value={user?.fullName ?? ''}
            leftIcon={<UserRound size={16} />}
          />
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium text-gray-700">E-mail</span>
          <InputWithIcon
            value={user?.email ?? ''}
            readOnly
            leftIcon={<Mail size={16} />}
          />
          <p className="text-xs text-gray-500">
            O e-mail não pode ser alterado
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full mt-2"
          disabled
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
          <LogOut size={18} />
          Sair da conta
        </Button>
      </div>
    </FormLayout>
  )
}
