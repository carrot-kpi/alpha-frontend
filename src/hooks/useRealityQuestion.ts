import { useEffect, useMemo, useState } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useRealityContract } from './useContract'
import { useActiveWeb3React } from './useActiveWeb3React'
import {  parseUnits } from '@ethersproject/units'
import { Zero } from '@ethersproject/constants'
import { NETWORK_DETAIL } from '../constants'
import { BigNumber } from '@ethersproject/bignumber'


export function useRealityQuestion(kpiId:string | undefined): { transactionLoader: boolean; submitAnswer: (answer: string) => Promise<void>;currentBond:BigNumber } {
  const realityContract = useRealityContract(true)
  const callParams = useMemo(() => [kpiId], [kpiId])
  const bondAmount = useSingleCallResult(realityContract, 'getBond', callParams)
  const { library:provider,chainId } = useActiveWeb3React()
  const [currentBond,setCurrentBond]=useState<BigNumber>(Zero)

  console.log(realityContract)
  useEffect(()=>{
    if(!kpiId) return
    console.log('question id ',kpiId)
    setCurrentBond(bondAmount && bondAmount.result ? bondAmount.result[0]:Zero)

  },[kpiId])

  const [transactionLoader, setTransactionLoader] = useState(false)

  const submitAnswer=async (answer:string)=>{
    try{
      setTransactionLoader(true)
        if(realityContract && bondAmount  && provider && !bondAmount.error && chainId){
          const currentNetwork=NETWORK_DETAIL[chainId]
          const initialBondAmount =
            currentNetwork.chainName==='xDai'  ? parseUnits('10', currentNetwork.nativeCurrency.decimals) : parseUnits('0.01', currentNetwork.nativeCurrency.decimals)
          const bond=bondAmount.result && !bondAmount.result[0].eq(Zero)?bondAmount.result[0].mul(2):initialBondAmount
          const signer=provider.getSigner()
          const contract=realityContract.connect(signer)
          const txRecepir=await contract.submitAnswer(kpiId,answer,0,{value:bond})

          console.log(txRecepir)
        }


    }catch (e) {
      console.log(e)
      setTransactionLoader(false)
    }
  }


  return {  transactionLoader, submitAnswer,currentBond }
}
