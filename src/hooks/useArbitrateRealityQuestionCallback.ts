import { useCallback } from 'react'
import { useRealityArbitratorContract } from './useContract'
import { useActiveWeb3React } from './useActiveWeb3React'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { useTransactionAdder } from '../state/transactions/hooks'
import { KpiToken } from '@carrot-kpi/alpha-sdk'

export function useArbitrateRealityQuestionCallback(
  arbitratorAddress?: string,
  kpiToken?: KpiToken,
  fee?: BigNumber
): () => Promise<void> {
  const { chainId } = useActiveWeb3React()
  const arbitratorContract = useRealityArbitratorContract(arbitratorAddress, true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!chainId || !kpiToken || !arbitratorContract || !fee) return
    try {
      const tx = await arbitratorContract.requestArbitration(kpiToken.kpiId, MaxUint256, {
        value: fee,
      })
      addTransaction(tx, { summary: `Apply for arbitration` })
    } catch (error) {
      console.error('error applying for arbitration in reality.eth question', error)
    }
  }, [addTransaction, arbitratorContract, chainId, fee, kpiToken])
}
