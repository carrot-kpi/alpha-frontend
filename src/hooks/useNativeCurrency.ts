import { Currency, ChainId, useEthers } from '@usedapp/core'
import { NATIVE_CURRENCY } from '@carrot-kpi/sdk'

export function useNativeCurrency(): Currency {
  const { chainId } = useEthers()
  return NATIVE_CURRENCY[chainId || ChainId.Mainnet]
}
