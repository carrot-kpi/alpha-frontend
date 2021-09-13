import { Contract, ContractInterface } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { useEthers } from '@usedapp/core'

export function useContract(
  address: string | undefined,
  abi: ContractInterface,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useEthers()

  return useMemo(() => {
    if (!address || !abi || !library) return null
    try {
      return new Contract(address, abi, withSignerIfPossible && account ? library.getSigner(account) : library)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, abi, library, withSignerIfPossible, account])
}
