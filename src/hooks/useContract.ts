import { ChainId, MULTICALL2_ABI, MULTICALL2_ADDRESS } from '@carrot-kpi/sdk-core'
import { KPI_TOKEN_ABI, REALITY_ABI, REALITY_ADDRESS } from '@carrot-kpi/alpha-sdk'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useContract(
  address: string | undefined,
  abi: ContractInterface,
  withSignerIfPossible = false
): Contract | null {
  const { library, account } = useActiveWeb3React()

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

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL2_ADDRESS[chainId], MULTICALL2_ABI)
}

export function useRealityContract(withSignerIfPossible = false): Contract | null {
  const { chainId } = useActiveWeb3React()
  // FIXME: use mainnet as the default key
  return useContract(REALITY_ADDRESS[(chainId as ChainId) || ChainId.GNOSIS], REALITY_ABI, withSignerIfPossible)
}

export function useKpiTokenContract(address?: string, withSignerIfPossible = false): Contract | null {
  return useContract(address, KPI_TOKEN_ABI, withSignerIfPossible)
}
