import { useEffect, useState } from 'react'
import { useKpiTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useIsKpiTokenFinalized(kpiTokenAddress?: string): { loading: boolean; finalized: boolean } {
  const kpiTokenContract = useKpiTokenContract(kpiTokenAddress)
  const wrappedResult = useSingleCallResult(kpiTokenContract, 'finalized')

  const [loading, setLoading] = useState(true)
  const [finalized, setFinalized] = useState(false)

  useEffect(() => {
    if (!kpiTokenAddress || !kpiTokenContract) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch kpi token finalization status')
      setLoading(true)
      return
    }
    setLoading(false)
    setFinalized(wrappedResult.result[0])
  }, [kpiTokenContract, kpiTokenAddress, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, finalized }
}
