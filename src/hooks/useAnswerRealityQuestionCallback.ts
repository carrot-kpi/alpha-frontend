import { useCallback } from 'react'
import { useRealityContract } from './useContract'
import { useActiveWeb3React } from './useActiveWeb3React'
import { NETWORK_DETAIL } from '../constants'
import { BigNumber } from '@ethersproject/bignumber'
import { useTransactionAdder } from '../state/transactions/hooks'

export function useAnswerRealityQuestionCallback(
  questionId?: string,
  answer?: string,
  bond?: BigNumber
): () => Promise<void> {
  const { chainId } = useActiveWeb3React()
  const realityContract = useRealityContract(true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!chainId || !questionId || !realityContract || !answer) return
    try {
      const value = bond || BigNumber.from(NETWORK_DETAIL[chainId].defaultBond)
      const tx = await realityContract.submitAnswer(questionId, answer, 0, {
        value,
      })
      addTransaction(tx, { summary: `Answer` })
    } catch (error) {
      console.error('error answering reality.eth question', error)
    }
  }, [addTransaction, answer, bond, chainId, questionId, realityContract])
}
