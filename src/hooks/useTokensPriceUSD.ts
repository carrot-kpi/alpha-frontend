import { useEffect, useState } from 'react'
import { Amount, Currency, Token } from '@carrot-kpi/sdk-core'
import { useSwaprTokensPriceUSD } from './useSwaprTokensPriceUSD'
import { useHoneyswapTokensPriceUSD } from './useHoneyswapTokensPriceUSD'

export function useTokensPriceUSD(tokens?: Token[]): {
  loading: boolean
  prices: {
    [address: string]: Amount<Currency>
  }
} {
  const { loading: loadingSwaprPrices, prices: swaprPrices } = useSwaprTokensPriceUSD(tokens)
  const { loading: loadingHoneyswapPrices, prices: honeyswapPrices } = useHoneyswapTokensPriceUSD(tokens)

  const [loading, setLoading] = useState(true)
  const [prices, setPrices] = useState<{ [address: string]: Amount<Currency> }>({})

  useEffect(() => {
    if (loadingSwaprPrices || loadingHoneyswapPrices) {
      setLoading(true)
      setPrices({})
      return
    }
    // Swapr has the precedence over other price sources here
    setPrices({
      ...honeyswapPrices,
      ...swaprPrices,
    })
    setLoading(false)
  }, [honeyswapPrices, loadingHoneyswapPrices, loadingSwaprPrices, swaprPrices])

  return { loading, prices }
}
