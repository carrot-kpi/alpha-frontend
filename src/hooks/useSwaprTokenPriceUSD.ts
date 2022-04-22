import { useEffect, useState } from 'react'
import { Amount, Currency, Token } from '@carrot-kpi/sdk-core'
import { gql } from '@apollo/client'
import { useSwaprSubgraphClient } from './useSwaprSubgraphClient'
import { ZERO_USD } from '../constants'
import { Decimal } from 'decimal.js-light'
import { parseUnits } from '@ethersproject/units'

const PRICE_QUERY = gql`
  query getPriceFragments($tokenId: ID!) {
    bundle(id: "1") {
      nativeCurrencyPrice
    }
    token(id: $tokenId) {
      derivedNativeCurrency
    }
  }
`

interface PriceQueryResponse {
  bundle?: { nativeCurrencyPrice: string }
  token?: { derivedNativeCurrency: string }
}

export function useSwaprTokenPriceUSD(token?: Token): { loading: boolean; price: Amount<Currency> } {
  const swaprSubgraphClient = useSwaprSubgraphClient()
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(ZERO_USD)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!token) return
      if (!cancelled) setLoading(true)
      try {
        const { data: response } = await swaprSubgraphClient.query<PriceQueryResponse>({
          query: PRICE_QUERY,
          variables: {
            tokenId: token.address.toLowerCase(),
          },
        })
        if (!response.bundle || !response.token) {
          if (!cancelled) setPrice(ZERO_USD)
          return
        }
        const usdDecimals = Currency.USD.decimals
        const price = parseUnits(
          new Decimal(response.token.derivedNativeCurrency)
            .mul(response.bundle.nativeCurrencyPrice)
            .toFixed(usdDecimals),
          usdDecimals
        )
        setPrice(new Amount(Currency.USD, price))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [swaprSubgraphClient, token])

  return { loading, price }
}
