import { gql, useQuery } from '@apollo/client'
import Decimal from 'decimal.js-light'
import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'
import { useEffect, useState } from 'react'
import { Amount, Currency } from '@carrot-kpi/sdk'
import { ZERO_USD } from '../constants'
import { useNativeCurrency } from './useNativeCurrency'
import { useSwaprSubgraphClient } from './useSwaprSubgraphClient'

const QUERY = gql`
  query {
    bundle(id: "1") {
      nativeCurrencyPrice
    }
  }
`

export function useNativeCurrencyUSDPrice() {
  const swaprSubgraphClient = useSwaprSubgraphClient()
  const nativeCurrency = useNativeCurrency()
  const {
    loading: loadingPrice,
    error,
    data,
  } = useQuery<{ bundle: { nativeCurrencyPrice: string } }>(QUERY, {
    client: swaprSubgraphClient,
  })

  const [priceUSD, setPriceUSD] = useState(ZERO_USD)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loadingPrice) {
      setLoading(true)
      setPriceUSD(ZERO_USD)
      return
    }
    if (!data || error) {
      setLoading(false)
      setPriceUSD(ZERO_USD)
      return
    }
    setLoading(false)
    setPriceUSD(
      new Amount<Currency>(
        Currency.USD,
        BigNumber.from(
          parseUnits(
            new Decimal(data.bundle.nativeCurrencyPrice).toFixed(Currency.USD.decimals),
            Currency.USD.decimals
          ).toString()
        )
      )
    )
  }, [data, error, loadingPrice, nativeCurrency])

  return { loading, priceUSD }
}
