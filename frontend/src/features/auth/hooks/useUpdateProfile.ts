import { useMutation } from '@apollo/client/react'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import type { UpdateProfileResult, UpdateProfileVariables } from '../auth.types'
import { UPDATE_PROFILE_MUTATION, ME_QUERY } from '../auth.gql'

export const useUpdateProfile = () => {
  const [mutate, { loading }] = useMutation<
    UpdateProfileResult,
    UpdateProfileVariables
  >(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [ME_QUERY],
  })

  const updateProfile = async (fullName: string) => {
    try {
      await mutate({ variables: { input: { fullName } } })
      showSuccessToast('Perfil atualizado com sucesso.')
      return true
    } catch (err) {
      showErrorToast(err, 'Não foi possível atualizar o perfil.')
      return false
    }
  }

  return { updateProfile, loading }
}
