import { useState } from 'react'
import { ArrowUpDown, Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { PageHeader } from '@/components/ui/PageHeader'
import { CategoryCard } from '@/features/categories/components/CategoryCard'
import { CreateCategoryDialog } from '@/features/categories/components/CreateCategoryDialog'
import { CategoryMetricCard } from '@/features/categories/components/CategoryMetricCard'

import { useCategoriesPage } from '@/features/categories/hooks/useCategoriesPage'
import {
  categoryIconMap,
  categoryIconTextClasses,
  MostUsedFallbackIcon,
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'

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

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<EditingCategory | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] =
    useState<DeletingCategory | null>(null)

  const handleEditOpenChange = (open: boolean) => {
    setIsEditOpen(open)

    if (!open) {
      setEditingCategory(null)
    }
  }

  const handleDeleteOpenChange = (open: boolean) => {
    setIsDeleteOpen(open)

    if (!open) {
      setDeletingCategory(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return
    const result = await actions.remove(deletingCategory.id)
    if (result) {
      handleDeleteOpenChange(false)
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
          setDeletingCategory({ id: category.id, name: category.name })
          setIsDeleteOpen(true)
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
          <CreateCategoryDialog
            onSubmit={actions.create}
            trigger={
              <Button size="sm">
                <Plus />
                Nova categoria
              </Button>
            }
          />
        }
      />

      <CreateCategoryDialog
        open={isEditOpen}
        onOpenChange={handleEditOpenChange}
        onSubmit={(payload) => {
          if (!editingCategory) return Promise.resolve(false)
          return actions.update({ id: editingCategory.id, ...payload })
        }}
        closeOnSubmit
        title="Editar categoria"
        description="Atualize os dados da categoria"
        submitLabel="Salvar alterações"
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
      <Dialog open={isDeleteOpen} onOpenChange={handleDeleteOpenChange}>
        <DialogContent className="max-w-[420px]" showCloseButton={false}>
          <DialogHeader className="gap-3 text-left">
            <DialogTitle>Excluir categoria</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria
              {deletingCategory ? ` “${deletingCategory.name}”` : ''}? Todas as
              transações associadas a essa categoria perderão os vínculos a essa
              categoria. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
