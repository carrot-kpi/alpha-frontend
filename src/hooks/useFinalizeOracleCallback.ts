import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useContract } from './useContract'

const ORACLE_FINALIZE_ABI = [
  {
    inputs: [],
    name: 'finalize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export function useFinalizeOracleCallback(oracleAddress?: string): () => Promise<void> {
  const oracleContract = useContract(oracleAddress, ORACLE_FINALIZE_ABI, true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!oracleAddress || !oracleContract) return
    try {
      const tx = await oracleContract.finalize()
      addTransaction(tx, { summary: `Finalize oracle at address ${oracleAddress}` })
    } catch (error) {
      console.error('error finalizing carrot', error)
    }
  }, [addTransaction, oracleAddress, oracleContract])
}
