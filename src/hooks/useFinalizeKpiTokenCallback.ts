import { KPI_TOKEN_ABI, KpiToken } from '@carrot-kpi/alpha-sdk'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useContract } from './useContract'

export function useFinalizeKpiTokenCallback(kpiToken?: KpiToken): () => Promise<void> {
  const kpiTokenContract = useContract(kpiToken?.address, KPI_TOKEN_ABI, true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!kpiTokenContract || !kpiToken) return
    try {
      const tx = await kpiTokenContract.finalize()
      addTransaction(tx, { summary: `Finalize ${kpiToken.symbol}` })
    } catch (error) {
      console.error('error finalizing carrot', error)
    }
  }, [addTransaction, kpiToken, kpiTokenContract])
}
