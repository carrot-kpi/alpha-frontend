import { useEffect, useState } from 'react'
import { Amount, Currency, Token } from '@carrot-kpi/sdk'
import { gql } from '@apollo/client'
import { useHoneyswapSubgraphClient } from './useHoneyswapSubgraphClient'
import { ZERO_USD } from '../constants'
import { Decimal } from 'decimal.js-light'
import { parseUnits } from '@ethersproject/units'

const PRICE_QUERY = gql`
  query getPriceFragments($tokenId: ID!) {
    bundle(id: "1") {
      ethPrice
    }
    token(id: $tokenId) {
      derivedETH
    }
  }
`

interface PriceQueryResponse {
  bundle?: { ethPrice: string }
  token?: { derivedETH: string }
}

export function useHoneyswapTokenPriceUSD(token?: Token): { loading: boolean; price: Amount<Currency> } {
  const honeyswapSubgraphClient = useHoneyswapSubgraphClient()
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(ZERO_USD)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!token || !honeyswapSubgraphClient) return
      if (!cancelled) setLoading(true)
      try {
        const { data: response } = await honeyswapSubgraphClient.query<PriceQueryResponse>({
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
          new Decimal(response.token.derivedETH).mul(response.bundle.ethPrice).toFixed(usdDecimals),
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
  }, [honeyswapSubgraphClient, token])

  return { loading, price }
}
