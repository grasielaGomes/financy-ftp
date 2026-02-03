import { gql } from '@apollo/client'

export const TRANSACTIONS_QUERY = gql`
  query Transactions($input: TransactionsQueryInput) {
    transactions(input: $input) {
      total
      items {
        id
        title
        amount
        type
        occurredAt
        category {
          id
          name
          iconKey
          colorKey
        }
      }
    }
  }
`

export const TRANSACTION_PERIODS_QUERY = gql`
  query TransactionPeriods {
    transactionPeriods {
      period
      count
    }
  }
`

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      title
      amount
      type
      occurredAt
      category {
        id
        name
        iconKey
        colorKey
      }
    }
  }
`

export const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      id
      title
      amount
      type
      occurredAt
      category {
        id
        name
        iconKey
        colorKey
      }
    }
  }
`

export const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
