import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

import { MetricCard } from '@/features/transactions/components/MetricCard'

export const DashboardPage = () => {
  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            icon={<Wallet className="text-purple-base" />}
            label="Saldo total"
            value="R$ 12.847,32"
          />
          <MetricCard
            icon={<ArrowUpCircle className="text-green-base" />}
            label="Receitas do mês"
            value="R$ 4.250,00"
          />
          <MetricCard
            icon={<ArrowDownCircle className="text-red-base" />}
            label="Despesas do mês"
            value="R$ 2.180,45"
          />
        </section>
      </div>
    </main>
  )
}
