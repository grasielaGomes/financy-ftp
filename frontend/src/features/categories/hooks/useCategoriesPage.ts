import { useCallback, useMemo } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import type { DocumentNode } from 'graphql'

import { showErrorToast, showSuccessToast } from '@/lib/toast'

import {
  CATEGORIES_QUERY,
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
} from '../api/categories.gql'

import {
  type CategoryColorKey,
  type CategoryIconKey,
  getSafeColorKey,
  getSafeIconKey,
} from '../helpers/categoryOptions'

type Category = {
  id: string
  name: string
  description?: string | null
  iconKey: unknown
  colorKey: unknown
  transactionsCount?: number | null
}

type CategoryUI = {
  id: string
  name: string
  description?: string | null
  iconKey: CategoryIconKey
  colorKey: CategoryColorKey
  transactionsCount: number
}

type CreatePayload = {
  name: string
  description?: string
  iconKey: CategoryIconKey
  colorKey: CategoryColorKey
}

type UpdatePayload = {
  id: string
  name?: string
  description?: string
  iconKey?: CategoryIconKey
  colorKey?: CategoryColorKey
}

type CategoriesQueryData = {
  categories: Category[]
}

type CreateCategoryMutationData = {
  createCategory: Category
}

type UpdateCategoryMutationData = {
  updateCategory: Category
}

type DeleteCategoryMutationData = {
  deleteCategory: boolean
}

type CreateCategoryVariables = {
  input: CreatePayload
}

type UpdateCategoryVariables = {
  input: UpdatePayload
}

type DeleteCategoryVariables = {
  id: string
}

type RefetchQuery = { query: DocumentNode }

type MutationExecutor<TVariables> = (args: {
  variables: TVariables
  refetchQueries: RefetchQuery[]
  awaitRefetchQueries: boolean
}) => Promise<unknown>

const CATEGORIES_REFETCH: RefetchQuery[] = [{ query: CATEGORIES_QUERY }]

const toCategoryUI = (c: Category): CategoryUI => {
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? null,
    iconKey: getSafeIconKey(c.iconKey),
    colorKey: getSafeColorKey(c.colorKey),
    transactionsCount: Number(c.transactionsCount ?? 0),
  }
}

const buildMetrics = (
  categories: CategoryUI[],
): {
  totalCategories: number
  totalTransactions: number
  mostUsedName: string
  mostUsedIconKey?: CategoryIconKey
  mostUsedColorKey?: CategoryColorKey
} => {
  const totalCategories = categories.length

  let totalTransactions = 0
  let mostUsed: CategoryUI | null = null
  let mostUsedCount = -1

  for (const category of categories) {
    const count = Number(category.transactionsCount ?? 0)
    totalTransactions += count

    if (count > mostUsedCount) {
      mostUsedCount = count
      mostUsed = category
    }
  }

  if (totalTransactions === 0) {
    return {
      totalCategories,
      totalTransactions,
      mostUsedName: '—',
      mostUsedIconKey: 'piggy-bank',
      mostUsedColorKey: 'green',
    }
  }

  return {
    totalCategories,
    totalTransactions,
    mostUsedName: mostUsed?.name ?? '—',
    mostUsedIconKey: mostUsed?.iconKey,
    mostUsedColorKey: mostUsed?.colorKey,
  }
}

export const useCategoriesPage = () => {
  const { data, loading, error } =
    useQuery<CategoriesQueryData>(CATEGORIES_QUERY)

  const [createCategory, { loading: creating }] = useMutation<
    CreateCategoryMutationData,
    CreateCategoryVariables
  >(CREATE_CATEGORY_MUTATION)

  const [updateCategory, { loading: updating }] = useMutation<
    UpdateCategoryMutationData,
    UpdateCategoryVariables
  >(UPDATE_CATEGORY_MUTATION)

  const [deleteCategory, { loading: deleting }] = useMutation<
    DeleteCategoryMutationData,
    DeleteCategoryVariables
  >(DELETE_CATEGORY_MUTATION)

  const categoriesRaw = data?.categories ?? []
  const categories = useMemo(
    () => categoriesRaw.map(toCategoryUI),
    [categoriesRaw],
  )

  const metrics = useMemo(() => buildMetrics(categories), [categories])

  const runMutation = useCallback(
    async <TVariables>(
      executor: MutationExecutor<TVariables>,
      variables: TVariables,
      successMessage: string,
      errorMessage: string,
    ) => {
      try {
        await executor({
          variables,
          refetchQueries: CATEGORIES_REFETCH,
          awaitRefetchQueries: true,
        })

        showSuccessToast(successMessage)
        return true
      } catch (err) {
        showErrorToast(err, errorMessage)
        return false
      }
    },
    [],
  )

  const handleCreate = useCallback(
    (payload: CreatePayload) => {
      return runMutation(
        createCategory,
        { input: payload },
        'Categoria criada com sucesso.',
        'Não foi possível criar a categoria.',
      )
    },
    [createCategory, runMutation],
  )

  const handleUpdate = useCallback(
    (payload: UpdatePayload) => {
      return runMutation(
        updateCategory,
        { input: payload },
        'Categoria atualizada com sucesso.',
        'Não foi possível atualizar a categoria.',
      )
    },
    [runMutation, updateCategory],
  )

  const handleDelete = useCallback(
    (id: string) => {
      return runMutation(
        deleteCategory,
        { id },
        'Categoria removida com sucesso.',
        'Não foi possível remover a categoria.',
      )
    },
    [deleteCategory, runMutation],
  )

  return {
    loading,
    error,
    categories,
    metrics,
    actions: {
      creating,
      updating,
      deleting,
      create: handleCreate,
      update: handleUpdate,
      remove: handleDelete,
    },
  }
}
