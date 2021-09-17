import { useEffect, useMemo, useState } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useRealityContract } from './useContract'

export function useIsRealityQuestionFinalized(kpiId?: string): { loading: boolean; finalized: boolean } {
  const realityContract = useRealityContract(false)
  const callParams = useMemo(() => [kpiId], [kpiId])
  const wrappedResult = useSingleCallResult(realityContract, 'isFinalized', callParams)

  const [loading, setLoading] = useState(false)
  const [finalized, setFinalized] = useState(false)

  useEffect(() => {
    if (!kpiId || !realityContract) return
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
  }, [kpiId, realityContract, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, finalized }
}
