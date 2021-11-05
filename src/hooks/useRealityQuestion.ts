import { useEffect, useMemo, useState } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useRealityContract } from './useContract'
import { useActiveWeb3React } from './useActiveWeb3React'
import { parseUnits } from '@ethersproject/units'
import { Zero } from '@ethersproject/constants'
import { NETWORK_DETAIL } from '../constants'
import { BigNumber } from '@ethersproject/bignumber'

export function useRealityQuestion(kpiId: string | undefined): {
  transactionLoader: boolean
  submitAnswer: (answer: string) => Promise<void>
  currentAnswer: { answer: string; bond: BigNumber }
} {
  const realityContract = useRealityContract(true)
  const callParams = useMemo(() => [kpiId], [kpiId])
  const questionData = useSingleCallResult(realityContract, 'questions', callParams)
  const { library: provider, chainId } = useActiveWeb3React()
  const [transactionLoader, setTransactionLoader] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState<{ answer: string; bond: BigNumber }>({ answer: '', bond: Zero })

  useEffect(() => {
    if (!kpiId) return
    console.log('data I need', questionData)
    setCurrentAnswer(
      questionData && questionData.result
        ? { answer: questionData.result['best_answer'], bond: questionData.result.bond }
        : { answer: '', bond: Zero }
    )
  }, [kpiId, questionData])

  const submitAnswer = async (answer: string) => {
    try {
      setTransactionLoader(true)
      if (realityContract && questionData && provider && !questionData.error && chainId) {
        const currentNetwork = NETWORK_DETAIL[chainId]
        const initialquestionData =
          currentNetwork.chainName === 'xDai'
            ? parseUnits('10', currentNetwork.nativeCurrency.decimals)
            : parseUnits('0.01', currentNetwork.nativeCurrency.decimals)
        const bond =
          questionData.result && !questionData.result[6].eq(Zero) ? questionData.result[6].mul(2) : initialquestionData
        const txRecepir = await realityContract.submitAnswer(kpiId, answer, 0, { value: bond })
        console.log(txRecepir)
        await provider.waitForTransaction(txRecepir.hash)
        console.log(txRecepir)
        setTransactionLoader(false)
      }
    } catch (e) {
      console.log(e)
      setTransactionLoader(false)
    }
  }

  return { transactionLoader, submitAnswer, currentAnswer }
}
