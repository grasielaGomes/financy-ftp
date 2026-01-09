import { createBrowserRouter } from 'react-router-dom'

import { AuthPage, DashboardPage, NotFoundPage } from '@/pages'
import { RequireAuth } from './RequireAuth'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <DashboardPage />
      </RequireAuth>
    ),
  },
  { path: '*', element: <NotFoundPage /> },
])
