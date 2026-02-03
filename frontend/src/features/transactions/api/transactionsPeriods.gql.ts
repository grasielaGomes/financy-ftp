import { gql } from '@apollo/client'

export const TRANSACTION_PERIODS_QUERY = gql`
  query TransactionPeriods {
    transactionPeriods {
      period
      count
    }
  }
`
