import { useQuery } from '@apollo/client/react'
import { useToken } from '@/lib/storage/token'
import { ME_QUERY } from '@/features/auth/auth.gql'
import type { MeResult } from '@/features/auth/auth.types'

export const useMe = () => {
  const token = useToken()

  const query = useQuery<MeResult>(ME_QUERY, {
    skip: !token,
    fetchPolicy: 'cache-first',
  })

  return {
    user: query.data?.me ?? null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}
