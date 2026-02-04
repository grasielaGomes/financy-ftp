import { useEffect, useMemo, useState } from 'react'
import { Mail, UserRound, LogOut, Save } from 'lucide-react'

import { FormHeader, FormLayout } from '@/components/layout/FormLayout'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/Separator'
import { TextField } from '@/components/ui/TextField'
import { useLogout, useMe, useUpdateProfile } from '@/features/auth'

import { getInitials } from '@/utils/format'
import { showErrorToast } from '@/lib/toast'

export const ProfilePage = () => {
  const { user, loading } = useMe()
  const { logout } = useLogout({ showToast: true })
  const { updateProfile, loading: saving } = useUpdateProfile()

  const [fullName, setFullName] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    setFullName(user?.fullName ?? '')
    setTouched(false)
  }, [user?.fullName])

  const initials = useMemo(
    () => (loading ? '…' : getInitials(user?.fullName)),
    [loading, user?.fullName]
  )

  const originalFullName = (user?.fullName ?? '').trim()
  const currentFullName = fullName.trim()

  const isDirty = touched && currentFullName !== originalFullName
  const canSave = !!currentFullName && isDirty && !saving

  const handleSave = async () => {
    try {
      const ok = await updateProfile(currentFullName)
      if (ok) setTouched(false)
    } catch (err) {
      showErrorToast(err, 'Não foi possível atualizar o perfil.')
    }
  }

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
          value={fullName}
          leftIcon={<UserRound size={16} />}
          placeholder="Seu nome completo"
          errorMessage={
            touched && !currentFullName
              ? 'Nome completo é obrigatório.'
              : undefined
          }
          inputProps={{
            onChange: (e) => {
              setTouched(true)
              setFullName(e.target.value)
            },
            onBlur: () => setTouched(true),
          }}
        />

        <TextField
          id="email"
          label="E-mail"
          value={user?.email ?? ''}
          readOnly
          leftIcon={<Mail size={16} />}
          hint="O e-mail não pode ser alterado"
        />

        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full mt-2"
          onClick={handleSave}
          disabled={!canSave}
        >
          <Save size={18} />
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full"
          onClick={logout}
          disabled={saving}
        >
          <LogOut size={18} className="text-danger" />
          Sair da conta
        </Button>
      </div>
    </FormLayout>
  )
}
