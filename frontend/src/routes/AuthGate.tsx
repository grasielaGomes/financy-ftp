import { Outlet } from 'react-router-dom'
import { getToken } from '@/lib/storage/token'

export const AuthGate = () => {
  const token = getToken()

  return <Outlet context={{ isAuthed: !!token }} />
}
