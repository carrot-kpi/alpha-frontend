import { useEffect, useMemo, useState } from 'react'
import { KpiToken, Token, Amount } from '@carrot-kpi/sdk'
import { useKpiTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useKpiTokenBalance(
  kpiToken?: KpiToken,
  account?: string | null
): { loading: boolean; balance?: Amount<Token> } {
  const kpiTokenAddress = useMemo(() => kpiToken?.address, [kpiToken?.address])
  const kpiTokenContract = useKpiTokenContract(kpiTokenAddress)
  const callParams = useMemo(() => [account || undefined], [account])
  const wrappedResult = useSingleCallResult(kpiTokenContract, 'balanceOf', callParams)

  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<Amount<Token> | undefined>(undefined)

  useEffect(() => {
    if (!account || !kpiToken || !kpiTokenContract) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch balance', wrappedResult.error)
      setLoading(true)
      return
    }
    setLoading(false)
    setBalance(new Amount(kpiToken, wrappedResult.result[0]))
  }, [kpiToken, kpiTokenContract, wrappedResult.error, wrappedResult.loading, wrappedResult.result, account])

  return { loading, balance }
}
