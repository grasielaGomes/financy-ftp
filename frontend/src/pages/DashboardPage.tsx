import { LogoutButton } from '@/features/auth/components/LogoutButton'

export const DashboardPage = () => {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Logged in. Dashboard will be implemented next.
        </p>
      </div>

      <LogoutButton variant="outline" size="md">
        Sair
      </LogoutButton>
    </div>
  )
}
