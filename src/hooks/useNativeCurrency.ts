import { Currency, ChainId } from '@usedapp/core'
import { NATIVE_CURRENCY } from '@carrot-kpi/sdk'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useNativeCurrency(): Currency {
  const { chainId } = useActiveWeb3React()
  return NATIVE_CURRENCY[chainId || ChainId.Mainnet]
}
