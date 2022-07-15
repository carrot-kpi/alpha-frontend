import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useKpiTokenContract } from './useContract'

export function useRedeemKpiTokenCallback(kpiTokenAddress?: string, data?: string): () => Promise<void> {
  const kpiTokenContract = useKpiTokenContract(kpiTokenAddress, true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!kpiTokenAddress || !kpiTokenContract || !data) return
    try {
      const tx = await kpiTokenContract.redeem(data)
      addTransaction(tx, { summary: `Redeem KPI token at address ${kpiTokenAddress}` })
    } catch (error) {
      console.error('error finalizing carrot', error)
    }
  }, [addTransaction, data, kpiTokenAddress, kpiTokenContract])
}
