import type { ReactNode } from 'react'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context'

import { getToken } from '@/lib/storage/token'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_URL,
})

const authLink = new SetContextLink((prevContext) => {
  const token = getToken()

  return {
    headers: {
      ...(prevContext.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export const GraphQLProvider = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
