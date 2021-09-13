import { gql, useQuery } from '@apollo/client'
import Decimal from 'decimal.js-light'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { Amount } from '@carrot-kpi/sdk'
import { USD_CURRENCY, ZERO_USD } from '../constants'
import { useNativeCurrency } from './useNativeCurrency'
import { useSwaprSubgraphClient } from './useSwaprSubgraphClient'
import { Currency } from '@usedapp/core'

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
        USD_CURRENCY,
        BigNumber.from(
          parseUnits(
            new Decimal(data.bundle.nativeCurrencyPrice).toFixed(USD_CURRENCY.decimals),
            USD_CURRENCY.decimals
          ).toString()
        )
      )
    )
  }, [data, error, loadingPrice, nativeCurrency])

  return { loading, priceUSD }
}
