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
import { useSymmetricLpTokenPriceUSD } from './useSymmetricLpTokenPriceUSD'

const COINGECKO_PLATFORMS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'ethereum',
  [ChainId.RINKEBY]: 'ethereum',
  [ChainId.XDAI]: 'xdai',
}

export function useTokenPriceUSD(token?: Token): { loading: boolean; price: Amount<Currency> } {
  const { chainId } = useActiveWeb3React()
  const { loading: loadingSwaprPrice, price: swaprPrice } = useSwaprTokenPriceUSD(token)
  const { loading: loadingSymmetricLpTokenPrice, price: symmetricLpTokenPrice } = useSymmetricLpTokenPriceUSD(token)
  const coingeckoPrice = useCoingeckoTokenPrice(
    token?.address || AddressZero,
    'usd',
    chainId && COINGECKO_PLATFORMS[chainId]
  )
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(new Amount(Currency.USD, BigNumber.from('0')))

  useEffect(() => {
    let price
    if (!loadingSwaprPrice && !swaprPrice.isZero()) price = swaprPrice
    else if (!loadingSymmetricLpTokenPrice && !symmetricLpTokenPrice.isZero()) price = symmetricLpTokenPrice
    else if (coingeckoPrice)
      price = new Amount(
        Currency.USD,
        parseUnits(new Decimal(coingeckoPrice).toFixed(Currency.USD.decimals), Currency.USD.decimals)
      )
    else {
      setLoading(true)
      setPrice(ZERO_USD)
      return
    }
    setLoading(false)
    setPrice(price)
  }, [coingeckoPrice, loadingSwaprPrice, loadingSymmetricLpTokenPrice, swaprPrice, symmetricLpTokenPrice])

  return { loading, price }
}
