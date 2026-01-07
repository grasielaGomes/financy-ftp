const TOKEN_KEY = 'auth_token'

const isBrowser = () => typeof window !== 'undefined'

export const getToken = () => {
  if (!isBrowser()) {
    return null
  }

  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = (token: string) => {
  if (!isBrowser()) {
    return
  }

  try {
    window.localStorage.setItem(TOKEN_KEY, token)
  } catch {
    return null
  }
}
