import { Currency, ChainId } from '@carrot-kpi/sdk'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useNativeCurrency(): Currency {
  const { chainId } = useActiveWeb3React()
  // FIXME: use mainnet as the default indexing key
  return Currency.getNative(chainId || ChainId.RINKEBY)
}
