import { KPI_TOKEN_ABI, KpiToken } from '@carrot-kpi/alpha-sdk'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useContract } from './useContract'
import { useKpiTokenBalance } from './useKpiTokenBalance'

export function useBurnKpiTokenCallback(kpiToken?: KpiToken) {
  const { account } = useActiveWeb3React()
  const { balance } = useKpiTokenBalance(kpiToken, account || undefined)

  const kpiTokenContract = useContract(kpiToken?.address, KPI_TOKEN_ABI, true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!kpiTokenContract || !kpiToken) return
    try {
      const tx = await kpiTokenContract.redeem()
      addTransaction(tx, {
        summary: `Burn ${balance?.toFixed(3)} ${kpiToken.symbol}`,
      })
    } catch (error) {
      console.error('error redeeming carrot', error)
    }
  }, [addTransaction, balance, kpiToken, kpiTokenContract])
}
