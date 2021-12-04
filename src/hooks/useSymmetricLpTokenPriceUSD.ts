import { gql } from '@apollo/client'
import { Amount, ChainId, Currency, Token } from '@carrot-kpi/sdk'
import { parseUnits } from '@ethersproject/units'
import { Decimal } from 'decimal.js-light'
import { useEffect, useState } from 'react'
import { ZERO_USD } from '../constants'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useSymmetricSubgraphClient } from './useSymmetricSubgraphClient'

const INFO_QUERY = gql`
  query getPoolInfo($poolId: ID!) {
    pool(id: $poolId) {
      totalShares
      tokens {
        id
        balance
      }
    }
  }
`

interface InfoQueryResponse {
  pool?: { totalShares: string; tokens: { id: string; balance: string }[] }
}

const PRICE_QUERY = gql`
  query getPriceInfo($tokenIds: [ID!]!) {
    tokenPrices(where: { id_in: $tokenIds }) {
      id
      price
    }
  }
`

interface PriceQueryResponse {
  tokenPrices?: { id: string; price: string }[]
}

export function useSymmetricLpTokenPriceUSD(token?: Token): { loading: boolean; price: Amount<Currency> } {
  const { chainId } = useActiveWeb3React()
  const symmetricSubgraphClient = useSymmetricSubgraphClient()
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(ZERO_USD)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!token || chainId !== ChainId.XDAI) return
      if (!cancelled) setLoading(true)
      try {
        const { data: infoResponse } = await symmetricSubgraphClient.query<InfoQueryResponse>({
          query: INFO_QUERY,
          variables: {
            poolId: token.address.toLowerCase(),
          },
        })
        if (!infoResponse.pool) {
          if (!cancelled) setPrice(ZERO_USD)
          return
        }

        const { data: priceResponse } = await symmetricSubgraphClient.query<PriceQueryResponse>({
          query: PRICE_QUERY,
          variables: {
            tokenIds: infoResponse.pool.tokens.map((token) => token.id.split('-')[1]),
          },
        })
        if (!priceResponse.tokenPrices || priceResponse.tokenPrices.length === 0) {
          if (!cancelled) setPrice(ZERO_USD)
          return
        }

        const usdBalance = infoResponse.pool.tokens.reduce((usdBalance, token) => {
          const tokenPrice = priceResponse.tokenPrices?.find((price) => price.id === token.id.split('-')[1])
          if (!!tokenPrice) return usdBalance.plus(new Decimal(tokenPrice.price).times(token.balance))
          return usdBalance
        }, new Decimal(0))

        const usdDecimals = Currency.USD.decimals
        const price = parseUnits(usdBalance.dividedBy(infoResponse.pool.totalShares).toFixed(usdDecimals), usdDecimals)
        setPrice(new Amount(Currency.USD, price))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [chainId, symmetricSubgraphClient, token])

  return { loading, price }
}
