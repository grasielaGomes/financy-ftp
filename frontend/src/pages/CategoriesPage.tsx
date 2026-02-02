import { ArrowUpDown, Plus, Tag, Utensils } from 'lucide-react'

import { PageHeader } from '@/components/ui/PageHeader'
import { CategoryMetricCard } from '@/features/categories/components/CategoryMetricCard'

export const CategoriesPage = () => {
  return (
    <main className="page">
      <PageHeader
        title="Categorias"
        description="Organize suas transações por categorias"
        buttonLabel="Nova categoria"
        buttonIcon={<Plus />}
      />

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CategoryMetricCard
          icon={<Tag className="text-gray-700" />}
          label="Total de categorias"
          value="8"
        />
        <CategoryMetricCard
          icon={<ArrowUpDown className="text-purple-base" />}
          label="Total de transações"
          value="27"
        />
        <CategoryMetricCard
          icon={<Utensils className="text-blue-base" />}
          label="Categoria mais utilizada"
          value="Alimentação"
        />
      </section>
    </main>
  )
}
