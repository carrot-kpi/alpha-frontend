import { useEffect, useState } from 'react'
import { REALITY_ABI, REALITY_ADDRESS } from '@carrot-kpi/sdk'
import { useContract } from './useContract'
import { useEthers } from '@usedapp/core'
import { ChainId } from '@usedapp/core'

export function useIsRealityQuestionFinalized(kpiId?: string) {
  const { chainId } = useEthers()
  const realityContract = useContract(REALITY_ADDRESS[(chainId as ChainId) || ChainId.Mainnet], REALITY_ABI)

  const [realityQuestionFinalized, setRealityQuestionFinalized] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchResult = async () => {
      if (!realityContract || !kpiId) return
      setLoading(true)
      try {
        setRealityQuestionFinalized(await realityContract.isFinalized(kpiId))
      } catch (error) {
        console.error(`could not determine if reality question was finalized for kpi id ${kpiId}`, error)
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [kpiId, realityContract])

  return { loading, realityQuestionFinalized }
}
