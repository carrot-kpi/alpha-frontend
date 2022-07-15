import { useEffect, useState } from 'react'
import { useKpiTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useIsKpiTokenExpired(kpiTokenAddress?: string): { loading: boolean; expired: boolean } {
  const kpiTokenContract = useKpiTokenContract(kpiTokenAddress)
  const wrappedResult = useSingleCallResult(kpiTokenContract, 'expired')

  const [loading, setLoading] = useState(true)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!kpiTokenAddress || !kpiTokenContract) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch kpi token expiration status')
      setLoading(true)
      return
    }
    setLoading(false)
    setExpired(wrappedResult.result[0])
  }, [kpiTokenContract, kpiTokenAddress, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, expired }
}
