import { useEffect, useMemo, useState } from 'react'
import { KpiToken, Token } from '@carrot-kpi/sdk'
import { useKpiTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useIsKpiTokenFinalized(kpiToken?: KpiToken): { loading: boolean; finalized: boolean } {
  const kpiTokenAddress = useMemo(() => kpiToken?.address, [kpiToken?.address])
  const kpiTokenContract = useKpiTokenContract(kpiTokenAddress)
  const wrappedResult = useSingleCallResult(kpiTokenContract, 'finalized')

  const [loading, setLoading] = useState(false)
  const [finalized, setFinalized] = useState(false)

  useEffect(() => {
    if (!kpiToken || !kpiTokenContract) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch finalization status', wrappedResult.error)
      setLoading(true)
      return
    }
    setLoading(false)
    setFinalized(wrappedResult.result[0])
  }, [kpiToken, kpiTokenContract, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, finalized }
}
