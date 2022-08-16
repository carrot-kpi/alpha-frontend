import { useEffect, useMemo, useState } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useReality3Contract } from './useContract'

export function useIsRealityQuestionFinalized(questionId?: string): { loading: boolean; finalized: boolean } {
  const realityContract = useReality3Contract(false)
  const callParams = useMemo(() => [questionId], [questionId])
  const wrappedResult = useSingleCallResult(realityContract, 'isFinalized', callParams)

  const [loading, setLoading] = useState(true)
  const [finalized, setFinalized] = useState(false)

  useEffect(() => {
    if (!questionId || !realityContract) return
    if (wrappedResult.loading) {
      setLoading(true)
      setFinalized(false)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch reality question finalization status')
      setLoading(true)
      setFinalized(false)
      return
    }
    setLoading(false)
    setFinalized(wrappedResult.result[0])
  }, [questionId, realityContract, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, finalized }
}
