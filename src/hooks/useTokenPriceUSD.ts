import { useEffect, useState } from 'react'
import { Amount, ChainId, Currency, Token } from '@carrot-kpi/sdk'
import { parseUnits } from '@ethersproject/units'
import Decimal from 'decimal.js-light'
import { useCoingeckoTokenPrice } from '@usedapp/coingecko'
import { AddressZero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useSwaprTokenPriceUSD } from './useSwaprTokenPriceUSD'
import { ZERO_USD } from '../constants'

const COINGECKO_PLATFORMS: { [chainId in ChainId]: string } = {
  [ChainId.RINKEBY]: 'ethereum',
  [ChainId.XDAI]: 'xdai',
}

export function useTokenPriceUSD(token?: Token): { loading: boolean; price: Amount<Currency> } {
  const { chainId } = useActiveWeb3React()
  const { loading: loadingSwaprPrice, price: swaprPrice } = useSwaprTokenPriceUSD(token)
  const coingeckoPrice = useCoingeckoTokenPrice(
    token?.address || AddressZero,
    'usd',
    chainId && COINGECKO_PLATFORMS[chainId]
  )
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(new Amount(Currency.USD, BigNumber.from('0')))

  useEffect(() => {
    if (loadingSwaprPrice) {
      setLoading(true)
      return
    }
    const price = !swaprPrice.isZero()
      ? swaprPrice
      : coingeckoPrice
      ? new Amount(
          Currency.USD,
          parseUnits(new Decimal(coingeckoPrice).toFixed(Currency.USD.decimals), Currency.USD.decimals)
        )
      : ZERO_USD
    setLoading(false)
    setPrice(price)
  }, [coingeckoPrice, loadingSwaprPrice, swaprPrice])

  return { loading, price }
}
