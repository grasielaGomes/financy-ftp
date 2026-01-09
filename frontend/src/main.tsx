import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { router } from '@/routes/router'
import { GraphQLProvider } from '@/lib/graphql/client'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GraphQLProvider>
      <RouterProvider router={router} />
    </GraphQLProvider>
    <Toaster richColors />
  </React.StrictMode>
)
