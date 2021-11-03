import { useMemo, useState } from 'react'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useRealityContract } from './useContract'
import { useActiveWeb3React } from './useActiveWeb3React'
import { formatEther, parseUnits } from '@ethersproject/units'
import { Zero } from '@ethersproject/constants'
import { NETWORK_DETAIL } from '../constants'


export function useRealityQuestion(kpiId:string | undefined): { loading: boolean; submitAnswer: (answer: string) => Promise<void> } {
  const realityContract = useRealityContract(true)
  const callParams = useMemo(() => [kpiId], [kpiId])
  const bondAmount = useSingleCallResult(realityContract, 'getBond', callParams)
  const { library:provider,chainId } = useActiveWeb3React()


  console.log(realityContract)


  const [loading, setLoading] = useState(true)

  const submitAnswer=async (answer:string)=>{
    try{
      setLoading(true)
        if(realityContract && bondAmount  && provider && !bondAmount.error && chainId){
          const currentNetwork=NETWORK_DETAIL[chainId]
          const initialBondAmount =
            currentNetwork.chainName==='xDai'  ? parseUnits('10', currentNetwork.nativeCurrency.decimals) : parseUnits('0.01', currentNetwork.nativeCurrency.decimals)
          console.log(bondAmount.result && formatEther(bondAmount.result[0]))
          const bond=bondAmount.result && !bondAmount.result[0].eq(Zero)?bondAmount.result[0].mul(2):initialBondAmount
          const signer=provider.getSigner()
          const contract=realityContract.connect(signer)
          const txRecepir=await contract.submitAnswer(kpiId,answer,0,{value:bond})


          console.log(txRecepir)
        }


    }catch (e) {
      console.log(e)
      setLoading(false)
    }
  }


  return { loading, submitAnswer }
}
