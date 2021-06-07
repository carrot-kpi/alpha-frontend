import { useEffect, useState } from 'react'
import { REALITY_ABI, REALITY_ADDRESS, ChainId } from 'carrot-sdk'
import { useContract } from './useContract'
import { useWeb3React } from '@web3-react/core'

export function useIsRealityQuestionFinalized(kpiId?: string) {
  const { chainId } = useWeb3React()
  const realityContract = useContract(REALITY_ADDRESS[(chainId as ChainId) || ChainId.MAINNET], REALITY_ABI)

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
