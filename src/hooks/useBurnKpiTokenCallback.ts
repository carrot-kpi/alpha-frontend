import { KPI_TOKEN_ABI, KpiToken } from '@carrot-kpi/alpha-sdk'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useContract } from './useContract'
import { useKpiTokenBalances } from './useKpiTokenBalances'

export function useBurnKpiTokenCallback(kpiToken?: KpiToken) {
  const { account } = useActiveWeb3React()
  const kpiTokens = useMemo(() => (kpiToken ? [kpiToken] : []), [kpiToken])
  const { balances, loading } = useKpiTokenBalances(kpiTokens, account || undefined)

  const kpiTokenContract = useContract(kpiToken?.address, KPI_TOKEN_ABI, true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!kpiTokenContract || !kpiToken || loading || !balances || Object.keys(balances).length === 0) return
    try {
      const tx = await kpiTokenContract.redeem()
      addTransaction(tx, {
        summary: `Burn ${balances[0]?.toFixed(3)} ${kpiToken.symbol}`,
      })
    } catch (error) {
      console.error('error redeeming carrot', error)
    }
  }, [addTransaction, balances, loading, kpiToken, kpiTokenContract])
}
