import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'

import { useMe } from '@/features/auth/hooks/useMe'
import { getInitials } from '@/utils/format'
import { useLogout } from '@/features/auth/hooks/useLogout'

import { Avatar } from '@/components/ui/Avatar'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu'

// Comments in English by preference
const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors',
    isActive ? 'text-green-700' : 'text-gray-600 hover:text-gray-900'
  )

export const Header = () => {
  const navigate = useNavigate()
  const { user, loading } = useMe()
  const { logout } = useLogout({ showToast: true })

  const initials = loading ? '…' : getInitials(user?.fullName)

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/dashboard" className={navLinkClassName}>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={navLinkClassName}>
            Transações
          </NavLink>
          <NavLink to="/categories" className={navLinkClassName}>
            Categorias
          </NavLink>
        </nav>

        {/* Desktop: direct navigation to /profile */}
        <button
          type="button"
          aria-label="Go to profile"
          onClick={() => navigate('/profile')}
          className="hidden md:block"
        >
          <Avatar initials={initials} size="md" />
        </button>

        {/* Mobile: dropdown menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label="User menu">
                <Avatar initials={initials} size="md" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Meu perfil
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/transactions')}>
                Transações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/categories')}>
                Categorias
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
