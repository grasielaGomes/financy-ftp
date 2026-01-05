import { createBrowserRouter } from 'react-router-dom'

import { AuthGate } from './AuthGate'
import { HomePage } from '@/pages/HomePage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Pages 4/5/6 are placeholders until we map Figma
import { Page4 } from '@/pages/Page4'
import { Page5 } from '@/pages/Page5'
import { Page6 } from '@/pages/Page6'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGate />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'page-4', element: <Page4 /> },
      { path: 'page-5', element: <Page5 /> },
      { path: 'page-6', element: <Page6 /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
