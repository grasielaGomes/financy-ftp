import { useSyncExternalStore } from 'react'

const TOKEN_KEY = 'financy:token'

type Listener = () => void
const listeners = new Set<Listener>()

const emit = () => {
  for (const l of listeners) l()
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
  emit()
}

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  emit()
}

export const subscribeToken = (listener: Listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useToken = () => {
  return useSyncExternalStore(subscribeToken, getToken, () => null)
}
