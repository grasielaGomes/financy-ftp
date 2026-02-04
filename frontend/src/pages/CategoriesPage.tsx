import { useState } from 'react'
import { ArrowUpDown, Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  CategoryCard,
  CategoryDialog,
  CategoryMetricCard,
  categoryIconMap,
  categoryIconTextClasses,
  MostUsedFallbackIcon,
  useCategoriesPage,
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'

type EditingCategory = {
  id: string
  name: string
  description?: string | null
  iconKey: CategoryIconKey
  colorKey: CategoryColorKey
}

type DeletingCategory = {
  id: string
  name: string
}

const formatItemsCount = (value: number) => {
  const n = Number.isFinite(value) ? value : 0
  const label = n === 1 ? 'item' : 'itens'
  return `${n} ${label}`
}

const renderMostUsedIcon = (
  iconKey?: CategoryIconKey,
  colorKey?: CategoryColorKey,
) => {
  if (!iconKey || !colorKey) {
    const Fallback = MostUsedFallbackIcon
    return <Fallback className="text-gray-700" />
  }

  const Icon = categoryIconMap[iconKey]
  const className = categoryIconTextClasses[colorKey]
  return <Icon className={className} />
}

export const CategoriesPage = () => {
  const { categories, metrics, actions, loading, error } = useCategoriesPage()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<EditingCategory | null>(null)
  const deleteConfirmation = useConfirmDelete<DeletingCategory>((category) =>
    actions.remove(category.id),
  )

  const handleEditOpenChange = (open: boolean) => {
    setIsEditOpen(open)

    if (!open) {
      setEditingCategory(null)
    }
  }

  const renderGridContent = () => {
    if (error) {
      return (
        <p className="text-sm text-danger">
          Não foi possível carregar categorias.
        </p>
      )
    }

    if (loading && categories.length === 0) {
      return <p className="text-sm text-gray-600">Carregando...</p>
    }

    return categories.map((category) => (
      <CategoryCard
        key={category.id}
        iconKey={category.iconKey}
        colorKey={category.colorKey}
        name={category.name}
        description={category.description ?? ''}
        tagLabel={category.name}
        itemsCount={formatItemsCount(category.transactionsCount)}
        onDelete={() => {
          deleteConfirmation.requestDelete({
            id: category.id,
            name: category.name,
          })
        }}
        onEdit={() => {
          setEditingCategory({
            id: category.id,
            name: category.name,
            description: category.description ?? '',
            iconKey: category.iconKey,
            colorKey: category.colorKey,
          })
          setIsEditOpen(true)
        }}
      />
    ))
  }

  return (
    <main className="page">
      <PageHeader
        title="Categorias"
        description="Organize suas transações por categorias"
        action={
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus />
            Nova categoria
          </Button>
        }
      />

      <CategoryDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={actions.create}
      />

      <CategoryDialog
        open={isEditOpen}
        onOpenChange={handleEditOpenChange}
        onSubmit={(payload) => {
          if (!editingCategory) return Promise.resolve(false)
          return actions.update({ id: editingCategory.id, ...payload })
        }}
        isEditing
        closeOnSubmit
        initialValues={
          editingCategory
            ? {
                name: editingCategory.name,
                description: editingCategory.description ?? '',
                iconKey: editingCategory.iconKey,
                colorKey: editingCategory.colorKey,
              }
            : undefined
        }
      />
      <ConfirmDialog
        open={deleteConfirmation.open}
        onOpenChange={deleteConfirmation.onOpenChange}
        title="Excluir categoria"
        description={
          <>
            Tem certeza que deseja excluir a categoria
            {deleteConfirmation.item
              ? ` “${deleteConfirmation.item.name}”`
              : ''}
            ? Todas as transações associadas a essa categoria perderão os
            vínculos a essa categoria. Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={deleteConfirmation.onConfirm}
      />

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CategoryMetricCard
          icon={<MostUsedFallbackIcon className="text-gray-700" />}
          label="Total de categorias"
          value={String(metrics.totalCategories)}
        />
        <CategoryMetricCard
          icon={<ArrowUpDown className="text-purple-base" />}
          label="Total de transações"
          value={String(metrics.totalTransactions)}
        />
        <CategoryMetricCard
          icon={renderMostUsedIcon(
            metrics.mostUsedIconKey,
            metrics.mostUsedColorKey,
          )}
          label="Categoria mais utilizada"
          value={metrics.mostUsedName}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {renderGridContent()}
      </section>
    </main>
  )
}
