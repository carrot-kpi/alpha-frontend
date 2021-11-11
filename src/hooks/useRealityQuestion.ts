import { useCallback, useMemo, useState } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useRealityContract } from './useContract'
import { useActiveWeb3React } from './useActiveWeb3React'
import { Zero } from '@ethersproject/constants'
import { NETWORK_DETAIL } from '../constants'
import { BigNumber } from '@ethersproject/bignumber'

export function useRealityQuestion(kpiId: string | undefined): {
  transactionLoader: boolean
  submitAnswer: (answer: string) => Promise<void>
  currentQuestionData: { answer: string; bond: BigNumber }
  getData: () => void
} {
  const realityContract = useRealityContract(true)
  const callParams = useMemo(() => [kpiId], [kpiId])
  const questionData = useSingleCallResult(realityContract, 'questions', callParams)
  const { library: provider, chainId } = useActiveWeb3React()
  const [transactionLoader, setTransactionLoader] = useState(false)
  const [currentQuestionData, setCurrentQuestionData] = useState<{
    answer: string
    bond: BigNumber
    isArbitrating: boolean
  }>({
    answer: '',
    bond: Zero,
    isArbitrating: false,
  })

  const getData = useCallback(() => {
    if (!kpiId) return

    setCurrentQuestionData(
      questionData && questionData.result
        ? {
            answer: questionData.result['best_answer'],
            bond: questionData.result.bond,
            isArbitrating: questionData.result.is_pending_arbitration,
          }
        : { answer: '', bond: Zero, isArbitrating: false }
    )
  }, [kpiId, questionData])

  const submitAnswer = async (answer: string) => {
    try {
      setTransactionLoader(true)
      if (realityContract && questionData && provider && !questionData.error && chainId) {
        const bond =
          questionData.result && !questionData.result.bond.eq(Zero)
            ? questionData.result.bond.mul(2)
            : NETWORK_DETAIL[chainId].defaultBond
        const txRecepit = await realityContract.submitAnswer(kpiId, answer, 0, { value: bond })

        await provider.waitForTransaction(txRecepit.hash)
        setTransactionLoader(false)
        getData()
      }
    } catch (e) {
      setTransactionLoader(false)
    }
  }

  return { transactionLoader, submitAnswer, currentQuestionData, getData }
}
