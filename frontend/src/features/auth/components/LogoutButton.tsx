import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/Button'
import { useLogout } from '@/features/auth/hooks/useLogout'

type LogoutButtonProps = ComponentProps<typeof Button>

export const LogoutButton = (props: LogoutButtonProps) => {
  const { logout } = useLogout()
  return <Button {...props} onClick={logout} />
}
