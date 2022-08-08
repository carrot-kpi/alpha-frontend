import { useEffect, useState } from 'react'
import { CAMPAIGNS } from '../constants/campaigns'
import { Amount, Token } from '@carrot-kpi/sdk-core'
import { KpiToken } from '@carrot-kpi/alpha-sdk'
import { gql } from '@apollo/client'
import { useCarrotSubgraphClient } from './useCarrotSubgraphClient'
import { BigNumber } from '@ethersproject/bignumber'
import { DateTime } from 'luxon'
import { useActiveWeb3React } from './useActiveWeb3React'
import { getAddress } from '@ethersproject/address'
import { Fetcher } from '@carrot-kpi/alpha-sdk'

const FEATURED_KPI_TOKENS_QUERY = gql`
  query kpiTokens($ids: [ID!]!) {
    kpiTokens(where: { id_in: $ids }) {
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

export function useFeaturedKpiTokens() {
  const { chainId } = useActiveWeb3React()
  const carrotSubgraphClient = useCarrotSubgraphClient()

  const [featuredKpiTokens, setFeaturedKpiTokens] = useState<KpiToken[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!chainId) return

      if (!cancelled) setLoading(true)
      try {
        // TODO: this is for test purposes, remove
        /* if (chainId === ChainId.GNOSIS) {
          setFeaturedKpiTokens([DAPPNODE_TEST_KPI_TOKEN_1])
          return
        }
        if (chainId === ChainId.MAINNET) {
          setFeaturedKpiTokens([DAPPNODE_TEST_KPI_TOKEN_2, DAPPNODE_TEST_KPI_TOKEN_3])
          return
        } */

        const { data: featuredKpiTokensData } = await carrotSubgraphClient.query<CarrotQueryResult>({
          query: FEATURED_KPI_TOKENS_QUERY,
          variables: {
            ids: chainId && CAMPAIGNS[chainId].filter((campaign) => campaign.featured).map((campaign) => campaign.id),
          },
        })
        const featuredKpiTokens: KpiToken[] = []

        // fetch all questions from IPFS/cache at once to boost performance
        const questionCids = featuredKpiTokensData.kpiTokens.map((kpiToken) => {
          return kpiToken.oracleQuestion.text
        })
        let questions
        try {
          questions = await Fetcher.fetchKpiTokenQuestions(questionCids)
        } catch (error) {
          console.error('could not fetch questions', error)
          if (!cancelled) setFeaturedKpiTokens([])
          if (!cancelled) setLoading(false)
          return
        }

        for (let i = 0; i < featuredKpiTokensData.kpiTokens.length; i++) {
          const kpiToken = featuredKpiTokensData.kpiTokens[i]
          const collateralToken = new Token(
            chainId,
            getAddress(kpiToken.collateral.token.id),
            kpiToken.collateral.token.decimals,
            kpiToken.collateral.token.symbol,
            kpiToken.collateral.token.name
          )
          const cid = kpiToken.oracleQuestion.text
          console.log(cid === 'QmZka1df5eSj8bebFLxbp1dnNxZUm3vW1uA7meahV9r6Ci')
          const question =
            cid === 'QmZka1df5eSj8bebFLxbp1dnNxZUm3vW1uA7meahV9r6Ci'
              ? `# What will the average TVL for the COW token on Swapr Gnosis Chain be from Aug 4th 15:00 UTC to Sep 1st 15:00 UTC?

## Details
This campaign will pay out in the range of 150k USD to 400k USD, with no payout when the result is below 150k USD and increasing linear payout over the range with a full collateral payout when the result is 400k USD or higher.
          
## Calculating the final answer
The dedicated chart on the official carrot.eth frontend will show daily Swapr COW token TVL in the specified date range. Each bar represents a TVL reading taken each day at 15:00 UTC. To calculate the final result, use the data for each bar and calculate the average between all the charted values.`
              : questions[cid]
          if (!question) {
            console.warn(`could not fetch kpi token question with cid ${cid}`)
            return
          }
          featuredKpiTokens.push(
            new KpiToken(
              chainId,
              getAddress(kpiToken.id),
              kpiToken.symbol,
              kpiToken.name,
              kpiToken.kpiId,
              BigNumber.from(kpiToken.totalSupply),
              kpiToken.oracle,
              question,
              BigNumber.from(kpiToken.lowerBound),
              BigNumber.from(kpiToken.higherBound),
              BigNumber.from(kpiToken.finalProgress),
              DateTime.fromSeconds(parseInt(kpiToken.expiresAt)),
              kpiToken.finalized,
              kpiToken.kpiReached,
              kpiToken.creator,
              new Amount<Token>(collateralToken, BigNumber.from(kpiToken.collateral.amount)),
              new Amount<Token>(collateralToken, BigNumber.from(kpiToken.fee))
            )
          )
        }

        if (!cancelled) setFeaturedKpiTokens(featuredKpiTokens)
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

  return { loading, featuredKpiTokens }
}
