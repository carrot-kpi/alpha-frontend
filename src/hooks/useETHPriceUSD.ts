import { useEffect, useState } from 'react'
import { Amount, Currency } from '@carrot-kpi/sdk'
import { parseEther } from '@ethersproject/units'
import Decimal from 'decimal.js-light'
import { useCoingeckoPrice } from '@usedapp/coingecko'
import { BigNumber } from '@ethersproject/bignumber'

export function useETHPriceUSD(): Amount<Currency> {
  const coingeckoPrice = useCoingeckoPrice('ethereum', 'usd')
  const [price, setPrice] = useState(new Amount(Currency.USD, BigNumber.from('0')))

  useEffect(() => {
    if (!coingeckoPrice) return
    setPrice(new Amount(Currency.USD, parseEther(new Decimal(coingeckoPrice).toFixed(18))))
  }, [coingeckoPrice])

  return price
}
