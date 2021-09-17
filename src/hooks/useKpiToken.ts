import { useEffect, useState } from 'react'
import { KpiToken, Amount, Token } from '@carrot-kpi/sdk'
import { gql, useQuery } from '@apollo/client'
import { useCarrotSubgraphClient } from './useCarrotSubgraphClient'
import { BigNumber } from '@ethersproject/bignumber'
import { DateTime } from 'luxon'
import { useActiveWeb3React } from './useActiveWeb3React'
import { getAddress } from '@ethersproject/address'

const KPI_TOKEN_QUERY = gql`
  query kpiToken($kpiId: ID!) {
    kpiTokens(where: { kpiId: $kpiId }) {
      id
      fee
      symbol
      name
      kpiId
      totalSupply
      oracle
      lowerBound
      higherBound
      finalProgress
      finalized
      kpiReached
      creator
      expiresAt
      oracleQuestion {
        text
      }
      collateral {
        token {
          id
          symbol
          name
          decimals
        }
        amount
      }
    }
  }
`

interface CarrotQueryResult {
  kpiTokens: {
    id: string
    fee: string
    symbol: string
    name: string
    kpiId: string
    expiresAt: string
    totalSupply: string
    oracle: string
    lowerBound: string
    higherBound: string
    finalProgress: string
    oracleQuestion: { text: string }
    finalized: boolean
    kpiReached: boolean
    creator: string
    collateral: {
      token: {
        id: string
        symbol: string
        name: string
        decimals: number
      }
      amount: string
    }
  }[]
}

export function useKpiToken(kpiId: string): { loading: boolean; kpiToken?: KpiToken } {
  const { chainId } = useActiveWeb3React()
  const carrotSubgraphClient = useCarrotSubgraphClient()
  const { data: kpiTokenData, loading: kpiTokenLoading } = useQuery<CarrotQueryResult>(KPI_TOKEN_QUERY, {
    variables: { kpiId },
    client: carrotSubgraphClient,
  })

  const [kpiToken, setKpiToken] = useState<KpiToken | undefined>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!chainId) return
    if (kpiTokenLoading || !kpiTokenData) {
      setLoading(true)
      setKpiToken(undefined)
      return
    }
    if (!kpiTokenData.kpiTokens || kpiTokenData.kpiTokens.length !== 1) {
      setLoading(false)
      setKpiToken(undefined)
      return
    }
    const rawKpiToken = kpiTokenData.kpiTokens[0]
    const collateralToken = new Token(
      chainId,
      getAddress(rawKpiToken.collateral.token.id),
      rawKpiToken.collateral.token.decimals,
      rawKpiToken.collateral.token.symbol,
      rawKpiToken.collateral.token.name
    )
    const kpiToken = new KpiToken(
      chainId,
      getAddress(rawKpiToken.id),
      rawKpiToken.symbol,
      rawKpiToken.name,
      rawKpiToken.kpiId,
      BigNumber.from(rawKpiToken.totalSupply),
      rawKpiToken.oracle,
      rawKpiToken.oracleQuestion.text,
      BigNumber.from(rawKpiToken.lowerBound),
      BigNumber.from(rawKpiToken.higherBound),
      BigNumber.from(rawKpiToken.finalProgress),
      DateTime.fromSeconds(parseInt(rawKpiToken.expiresAt)),
      rawKpiToken.finalized,
      rawKpiToken.kpiReached,
      rawKpiToken.creator,
      new Amount<Token>(collateralToken, BigNumber.from(rawKpiToken.collateral.amount)),
      new Amount<Token>(collateralToken, BigNumber.from(rawKpiToken.fee))
    )
    setKpiToken(kpiToken)
    setLoading(false)
  }, [chainId, kpiTokenData, kpiTokenLoading])

  return { loading, kpiToken }
}
