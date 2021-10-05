import { useEffect, useState } from 'react'
import { Amount, ChainId, Currency, Token } from '@carrot-kpi/sdk'
import { parseEther } from '@ethersproject/units'
import Decimal from 'decimal.js-light'
import { useCoingeckoTokenPrice } from '@usedapp/coingecko'
import { AddressZero } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from './useActiveWeb3React'

const COINGECKO_PLATFORMS: { [chainId in ChainId]: string } = {
  [ChainId.RINKEBY]: 'ethereum',
  [ChainId.XDAI]: 'xdai',
}

export function useTokenPriceUSD(token?: Token): Amount<Currency> {
  const { chainId } = useActiveWeb3React()
  const coingeckoPrice = useCoingeckoTokenPrice(
    token?.address || AddressZero,
    'usd',
    chainId && COINGECKO_PLATFORMS[chainId]
  )
  const [price, setPrice] = useState(new Amount(Currency.USD, BigNumber.from('0')))

  useEffect(() => {
    if (!coingeckoPrice) return
    setPrice(new Amount(Currency.USD, parseEther(new Decimal(coingeckoPrice).toFixed(18))))
  }, [coingeckoPrice])

  return price
}
