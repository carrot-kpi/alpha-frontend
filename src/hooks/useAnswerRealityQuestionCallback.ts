import { useCallback } from 'react'
import { useRealityContract } from './useContract'
import { useActiveWeb3React } from './useActiveWeb3React'
import { NETWORK_DETAIL } from '../constants'
import { BigNumber } from '@ethersproject/bignumber'
import { useTransactionAdder } from '../state/transactions/hooks'
import { KpiToken } from '@carrot-kpi/alpha-sdk'

export function useAnswerRealityQuestionCallback(
  kpiToken?: KpiToken,
  answer?: string,
  bond?: BigNumber
): () => Promise<void> {
  const { chainId } = useActiveWeb3React()
  const realityContract = useRealityContract(true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!chainId || !kpiToken || !realityContract || !answer) return
    try {
      const value = bond || BigNumber.from(NETWORK_DETAIL[chainId].defaultBond)
      const tx = await realityContract.submitAnswer(kpiToken.kpiId, answer, 0, {
        value,
      })
      addTransaction(tx, { summary: `Answer ${kpiToken.symbol}` })
    } catch (error) {
      console.error('error answering reality.eth question', error)
    }
  }, [addTransaction, answer, bond, chainId, kpiToken, realityContract])
}
