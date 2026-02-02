import * as React from 'react'
import { ArrowUpDown, Plus, Tag, Utensils } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { CategoryCard } from '@/features/categories/components/CategoryCard'
import { CreateCategoryDialog } from '@/features/categories/components/CreateCategoryDialog'
import { CategoryMetricCard } from '@/features/categories/components/CategoryMetricCard'
import {
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'

type CategoryItem = {
  id: string
  name: string
  description: string
  iconKey: CategoryIconKey
  colorKey: CategoryColorKey
  itemsCount: string
}

export const CategoriesPage = () => {
  const [categories, setCategories] = React.useState<CategoryItem[]>([
    {
      id: 'cml54ro8400012f74py2qkt35',
      name: 'Comidas',
      description: 'Compras no supermercado',
      iconKey: 'shopping-cart',
      colorKey: 'purple',
      itemsCount: '12 itens',
    },
    {
      id: 'cmkyfh8dl00019e74k1s0eed1',
      name: 'Alimentação',
      description: 'Restaurantes, delivery e refeições',
      iconKey: 'utensils',
      colorKey: 'blue',
      itemsCount: '1 item',
    },
    {
      id: 'cmkyfh8dl00029e744jihz2oi',
      name: 'Entretenimento',
      description: 'Cinema, jogos e lazer',
      iconKey: 'ticket',
      colorKey: 'pink',
      itemsCount: '2 itens',
    },
    {
      id: 'cmkyfh8dl00039e74xq1oukut',
      name: 'Investimento',
      description: 'Aplicações e retornos financeiros',
      iconKey: 'piggy-bank',
      colorKey: 'green',
      itemsCount: '1 item',
    },
    {
      id: 'cmkyfh8dl00049e74drgxg57e',
      name: 'Mercado',
      description: 'Compras de supermercado e mantimentos',
      iconKey: 'shopping-cart',
      colorKey: 'orange',
      itemsCount: '3 itens',
    },
    {
      id: 'cmkyfh8dl00059e74k5ua9sit',
      name: 'Salário',
      description: 'Renda mensal e bonificações',
      iconKey: 'briefcase',
      colorKey: 'green',
      itemsCount: '2 itens',
    },
    {
      id: 'cmkyfh8dl00069e74jkhjdpei',
      name: 'Saúde',
      description: 'Medicamentos, consultas e exames',
      iconKey: 'heart',
      colorKey: 'red',
      itemsCount: '0 itens',
    },
    {
      id: 'cmkyfh8dl00079e74cl7gqfzo',
      name: 'Transporte',
      description: 'Gasolina, transporte público e viagens',
      iconKey: 'car',
      colorKey: 'purple',
      itemsCount: '8 itens',
    },
    {
      id: 'cmkyfh8dl00089e74nt3lsyt3',
      name: 'Utilidades',
      description: 'Energia, água, internet e telefone',
      iconKey: 'tool-case',
      colorKey: 'yellow',
      itemsCount: '7 itens',
    },
  ])

  const handleCreateCategory = (payload: Omit<CategoryItem, 'itemsCount'>) => {
    setCategories((prev) => [
      { ...payload, itemsCount: '0 itens' },
      ...prev,
    ])
  }

  return (
    <main className="page">
      <PageHeader
        title="Categorias"
        description="Organize suas transações por categorias"
        action={
          <CreateCategoryDialog
            onSubmit={handleCreateCategory}
            trigger={
              <Button size="sm">
                <Plus />
                Nova categoria
              </Button>
            }
          />
        }
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

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          return (
            <CategoryCard
              key={category.id}
              iconKey={category.iconKey}
              colorKey={category.colorKey}
              name={category.name}
              description={category.description}
              tagLabel={category.name}
              itemsCount={category.itemsCount}
              onDelete={() => null}
              onEdit={() => null}
            />
          )
        })}
      </section>
    </main>
  )
}
