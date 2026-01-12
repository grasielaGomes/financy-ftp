import { createBrowserRouter } from 'react-router-dom'

import {
  AuthPage,
  CategoriesPage,
  DashboardPage,
  NotFoundPage,
  ProfilePage,
  TransactionsPage,
} from '@/pages'
import { RequireAuth } from './RequireAuth'
import { AppLayout } from '@/components/layout/AppLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      { path: '/transactions', element: <TransactionsPage /> },
      { path: '/categories', element: <CategoriesPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])
