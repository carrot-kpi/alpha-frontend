import { useEffect, useState } from 'react'
import { useOracleContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useIsOracleFinalized(oracleAddress?: string): { loading: boolean; finalized: boolean } {
  const kpiTokenContract = useOracleContract(oracleAddress)
  const wrappedResult = useSingleCallResult(kpiTokenContract, 'finalized')

  const [loading, setLoading] = useState(true)
  const [finalized, setFinalized] = useState(false)

  useEffect(() => {
    if (!oracleAddress || !kpiTokenContract) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch oracle finalization status')
      setLoading(true)
      return
    }
    setLoading(false)
    setFinalized(wrappedResult.result[0])
  }, [kpiTokenContract, oracleAddress, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, finalized }
}
