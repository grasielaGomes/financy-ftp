import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'

export const AppLayout = () => {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
        <Outlet />
      </main>
    </div>
  )
}
