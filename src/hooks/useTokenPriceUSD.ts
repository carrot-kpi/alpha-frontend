import { useEffect, useState } from 'react'
import { Amount, Currency, Token } from '@carrot-kpi/sdk'
import { gql, useQuery } from '@apollo/client'
import { useSwaprSubgraphClient } from './useSwaprSubgraphClient'
import { ZERO_USD } from '../constants'
import { parseUnits } from '@ethersproject/units'
import Decimal from 'decimal.js-light'
import { useNativeCurrencyUSDPrice } from './useNativeCurrencyUSDPrice'
import { useNativeCurrency } from './useNativeCurrency'

const SWAPR_TOKEN_PRICE_QUERY = gql`
  query swaprTokenDerivedNativeCurrency($id: ID!) {
    token(id: $id) {
      derivedNativeCurrency
    }
  }
`

interface SwaprQueryResult {
  token: {
    derivedNativeCurrency: string
  }
}

export function useTokenPriceUSD(token?: Token): { loading: boolean; priceUSD: Amount<Currency> } {
  const swaprSubgraphClient = useSwaprSubgraphClient()
  const nativeCurrency = useNativeCurrency()
  const { loading: loadingNativeCurrencyPrice, priceUSD: nativeCurrencyPrice } = useNativeCurrencyUSDPrice()
  const { data: swaprTokenPriceData, loading: swaprTokenPriceDataLoading } = useQuery<SwaprQueryResult>(
    SWAPR_TOKEN_PRICE_QUERY,
    {
      variables: { id: token?.address.toLowerCase() },
      client: swaprSubgraphClient,
    }
  )

  const [priceUSD, setPriceUSD] = useState(ZERO_USD)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setPriceUSD(ZERO_USD)
      return
    }
    if (swaprTokenPriceDataLoading || loadingNativeCurrencyPrice) {
      setLoading(true)
      setPriceUSD(ZERO_USD)
      return
    }
    if (!swaprTokenPriceData || !swaprTokenPriceData.token || !nativeCurrencyPrice) {
      setLoading(false)
      setPriceUSD(ZERO_USD)
      return
    }
    const tokenDerivedNativeCurrency = new Amount<Currency>(
      nativeCurrency,
      parseUnits(
        new Decimal(swaprTokenPriceData.token.derivedNativeCurrency).toFixed(nativeCurrency.decimals),
        nativeCurrency.decimals
      )
    )
    setPriceUSD(tokenDerivedNativeCurrency.multiply(nativeCurrencyPrice))
    setLoading(false)
  }, [
    loadingNativeCurrencyPrice,
    nativeCurrency,
    nativeCurrencyPrice,
    swaprTokenPriceData,
    swaprTokenPriceDataLoading,
    token,
  ])

  return { loading, priceUSD }
}
