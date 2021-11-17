import { useEffect, useMemo, useState } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useRealityContract } from './useContract'
import { Zero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'

export function useRealityQuestion(kpiId: string | undefined): {
  loading: boolean
  data: { answer: BigNumber; bond: BigNumber; arbitrating: boolean; arbitrator: string }
} {
  const realityContract = useRealityContract(true)
  const callParams = useMemo(() => [kpiId], [kpiId])
  const wrappedResult = useSingleCallResult(realityContract, 'questions', callParams)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    answer: BigNumber.from(0),
    bond: Zero,
    arbitrating: false,
    arbitrator: '',
  })

  useEffect(() => {
    if (!kpiId || !realityContract) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch reality question finalization status', wrappedResult.error)
      setLoading(true) // indefinitely load
      return
    }
    setLoading(false)
    setData({
      answer: BigNumber.from(wrappedResult.result.best_answer),
      bond: wrappedResult.result.bond,
      arbitrating: !!wrappedResult.result.is_pending_arbitration,
      arbitrator: wrappedResult.result.arbitrator,
    })
  }, [kpiId, realityContract, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, data }
}
