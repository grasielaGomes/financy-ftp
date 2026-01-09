import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useToken } from '@/lib/storage/token'

type RequireAuthProps = {
  children: ReactNode
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const token = useToken()

  if (!token) {
    return <Navigate to="/" replace />
  }

  return children
}
