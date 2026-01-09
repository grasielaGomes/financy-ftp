import { useApolloClient } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'

import { clearToken } from '@/lib/storage/token'
import { showSuccessToast } from '@/lib/toast'

type UseLogoutOptions = {
  redirectTo?: string
  showToast?: boolean
}

export const useLogout = (options: UseLogoutOptions = {}) => {
  const { redirectTo = '/', showToast = true } = options

  const navigate = useNavigate()
  const apollo = useApolloClient()

  const logout = async () => {
    clearToken()

    try {
      await apollo.clearStore()
    } catch {
      // Ignore cache errors; logout should still proceed
    }

    navigate(redirectTo, { replace: true })

    if (showToast) {
      showSuccessToast('Você saiu da sua conta.')
    }
  }

  return { logout }
}
