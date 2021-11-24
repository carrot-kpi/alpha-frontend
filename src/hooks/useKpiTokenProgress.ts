import { useEffect, useMemo, useState } from 'react'
import { KpiToken } from '@carrot-kpi/sdk'
import { useKpiTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { BigNumber } from '@ethersproject/bignumber'

export function useKpiTokenProgress(kpiToken?: KpiToken): { loading: boolean; progress: BigNumber } {
  const kpiTokenAddress = useMemo(() => kpiToken?.address, [kpiToken?.address])
  const kpiTokenContract = useKpiTokenContract(kpiTokenAddress)
  const wrappedResult = useSingleCallResult(kpiTokenContract, 'finalKpiProgress')

  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!kpiToken || !kpiTokenContract) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch final kpi progress', wrappedResult.error)
      setLoading(true)
      return
    }
    setLoading(false)
    setProgress(wrappedResult.result[0])
  }, [kpiToken, kpiTokenContract, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, progress }
}
