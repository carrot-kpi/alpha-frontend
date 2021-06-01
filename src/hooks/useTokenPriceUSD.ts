import { useEffect, useState } from 'react'
import { Token, CurrencyAmount } from 'carrot-sdk'
import { gql, useQuery } from '@apollo/client'
import { useSwaprSubgraphClient } from './useSwaprSubgraphClient'
import { ZERO_USD } from '../constants'
import { parseUnits } from 'ethers/lib/utils'
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

export function useTokenPriceUSD(token: Token): { loading: boolean; priceUSD: CurrencyAmount } {
  const swaprSubgraphClient = useSwaprSubgraphClient()
  const nativeCurrency = useNativeCurrency()
  const { loading: loadingNativeCurrencyPrice, priceUSD: nativeCurrencyPrice } = useNativeCurrencyUSDPrice()
  const { data: swaprTokenPriceData, loading: swaprTokenPriceDataLoading } = useQuery<SwaprQueryResult>(
    SWAPR_TOKEN_PRICE_QUERY,
    {
      variables: { id: token.address.toLowerCase() },
      client: swaprSubgraphClient,
    }
  )

  const [priceUSD, setPriceUSD] = useState(ZERO_USD)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
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
    const tokenDerivedNativeCurrency = new CurrencyAmount(
      nativeCurrency,
      parseUnits(
        new Decimal(swaprTokenPriceData.token.derivedNativeCurrency).toFixed(nativeCurrency.decimals.toNumber()),
        nativeCurrency.decimals
      )
    )
    console.log(tokenDerivedNativeCurrency.multiply(nativeCurrencyPrice).toFixed(2))
    setPriceUSD(tokenDerivedNativeCurrency.multiply(nativeCurrencyPrice))
    setLoading(false)
  }, [loadingNativeCurrencyPrice, nativeCurrency, nativeCurrencyPrice, swaprTokenPriceData, swaprTokenPriceDataLoading])

  return { loading, priceUSD }
}
