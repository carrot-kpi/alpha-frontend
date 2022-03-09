import { useEffect, useState } from 'react'
import { FEATURED_CAMPAIGNS } from '../constants/featured-campaigns'
import { KpiToken, Amount, Token /* ChainId */, ChainId } from '@carrot-kpi/sdk'
import { gql } from '@apollo/client'
import { useCarrotSubgraphClient } from './useCarrotSubgraphClient'
import { BigNumber } from '@ethersproject/bignumber'
import { DateTime } from 'luxon'
import { useActiveWeb3React } from './useActiveWeb3React'
import { getAddress } from '@ethersproject/address'
import { CID } from 'multiformats/cid'
/* import {
  MOCHI_TEST_KPI_TOKEN,
  DAPPNODE_TEST_KPI_TOKEN_1,
  DAPPNODE_TEST_KPI_TOKEN_2,
  DAPPNODE_TEST_KPI_TOKEN_3,
} from '../constants/tokens' */
import { IPFS_GATEWAY } from '../constants'
import {
  HND_TEST_KPI_TOKEN,
  HOPR_TEST_KPI_TOKEN,
  SWAPR_GNO_TEST_KPI_TOKEN,
  SWAPR_SWPR_TEST_KPI_TOKEN,
} from '../constants/tokens'

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
            ids: chainId && FEATURED_CAMPAIGNS[chainId].map((campaign) => campaign.id),
          },
        })
        const featuredKpiTokens: KpiToken[] = []

        // TODO: this is for test purposes, remove
        if (chainId === ChainId.GNOSIS) {
          featuredKpiTokens.push(SWAPR_GNO_TEST_KPI_TOKEN)
          featuredKpiTokens.push(SWAPR_SWPR_TEST_KPI_TOKEN)
          featuredKpiTokens.push(HOPR_TEST_KPI_TOKEN)
          featuredKpiTokens.push(HND_TEST_KPI_TOKEN)
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
          let question = kpiToken.oracleQuestion.text
          try {
            const cid = CID.parse(question)
            const response = await fetch(`${IPFS_GATEWAY}${cid.toV0()}`)
            if (!response.ok) {
              console.warn('could not load question from ipfs')
              continue
            }
            question = await response.text()
          } catch (error) {
            // not a cid
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
        if (!cancelled) {
          setFeaturedKpiTokens(featuredKpiTokens)
          setLoading(false)
        }
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
