import {
  REALITY_ABI,
  REALITY_ADDRESS,
  ChainId,
  PERMISSIVE_MULTICALL_ADDRESS,
  PERMISSIVE_MULTICALL_ABI,
  KPI_TOKEN_ABI,
} from '@carrot-kpi/sdk'
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
  return useContract(chainId && PERMISSIVE_MULTICALL_ADDRESS[chainId], PERMISSIVE_MULTICALL_ABI)
}

export function useRealityContract(withSignerIfPossible = false): Contract | null {
  const { chainId } = useActiveWeb3React()
  // FIXME: use mainnet as the default key
  return useContract(REALITY_ADDRESS[(chainId as ChainId) || ChainId.GNOSIS], REALITY_ABI, withSignerIfPossible)
}

export function useKpiTokenContract(address?: string, withSignerIfPossible = false): Contract | null {
  return useContract(address, KPI_TOKEN_ABI, withSignerIfPossible)
}
