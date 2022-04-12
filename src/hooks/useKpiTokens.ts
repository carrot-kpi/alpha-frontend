import { useEffect, useState } from 'react'
import { KpiToken, Amount, Token } from '@carrot-kpi/sdk'
import { gql } from '@apollo/client'
import { useCarrotSubgraphClient } from './useCarrotSubgraphClient'
import { BigNumber } from '@ethersproject/bignumber'
import { DateTime } from 'luxon'
import { useActiveWeb3React } from './useActiveWeb3React'
import { getAddress } from '@ethersproject/address'
import { CID } from 'multiformats/cid'

const KPI_TOKENS_QUERY = gql`
  query kpiTokens {
    kpiTokens {
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

export function useKpiTokens(): { loading: boolean; kpiTokens: KpiToken[] } {
  const { chainId } = useActiveWeb3React()
  const carrotSubgraphClient = useCarrotSubgraphClient()

  const [kpiTokens, setKpiTokens] = useState<KpiToken[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!chainId) return

      if (!cancelled) setLoading(true)
      try {
        const { data: kpiTokenData } = await carrotSubgraphClient.query<CarrotQueryResult>({
          query: KPI_TOKENS_QUERY,
        })
        if (!kpiTokenData.kpiTokens || kpiTokenData.kpiTokens.length === 0) {
          if (!cancelled) setLoading(false)
          if (!cancelled) setKpiTokens([])
          return
        }
        const mappedKpiTokens = (
          await Promise.all(
            kpiTokenData.kpiTokens.map(async (rawKpiToken) => {
              const collateralToken = new Token(
                chainId,
                getAddress(rawKpiToken.collateral.token.id),
                rawKpiToken.collateral.token.decimals,
                rawKpiToken.collateral.token.symbol,
                rawKpiToken.collateral.token.name
              )
              let question = rawKpiToken.oracleQuestion.text
              try {
                const cid = CID.parse(question)
                const response = await fetch(`https://ipfs.io/ipfs/${cid.toV0()}`)
                if (!response.ok) {
                  console.warn('could not load question from ipfs')
                  return undefined
                }
                question = await response.text()
              } catch (error) {
                // not a cid
              }
              return new KpiToken(
                chainId,
                getAddress(rawKpiToken.id),
                rawKpiToken.symbol,
                rawKpiToken.name,
                rawKpiToken.kpiId,
                BigNumber.from(rawKpiToken.totalSupply),
                rawKpiToken.oracle,
                question,
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
            })
          )
        ).filter((kpiToken) => !!kpiToken) as KpiToken[]

        if (!cancelled) setKpiTokens(mappedKpiTokens)
        if (!cancelled) setLoading(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [carrotSubgraphClient, chainId])

  return { loading, kpiTokens }
}
