import { Amount, Currency } from '@carrot-kpi/sdk-core'
import { useNativeCurrency } from './useNativeCurrency'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useRealityArbitratorContract } from './useContract'
import { useEffect, useMemo, useState } from 'react'

export function useArbitratorDisputeFee(
  arbitrator?: string,
  questionId?: string
): { loading: boolean; fee: Amount<Currency> | null } {
  const nativeCurrency = useNativeCurrency()
  const arbitratorContract = useRealityArbitratorContract(arbitrator, true)
  const inputs = useMemo(() => (questionId ? [questionId] : []), [questionId])
  const wrappedResult = useSingleCallResult(arbitratorContract, 'getDisputeFee', inputs)

  const [fee, setFee] = useState<Amount<Currency> | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!arbitrator || !questionId || !nativeCurrency) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch arbitrator dispute fee')
      setLoading(true)
      return
    }
    setLoading(false)
    setFee(new Amount<Currency>(nativeCurrency, wrappedResult.result[0]))
  }, [arbitrator, nativeCurrency, questionId, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, fee }
}
