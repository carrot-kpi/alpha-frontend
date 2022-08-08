import { useEffect, useState } from 'react'
import { KpiToken, Fetcher } from '@carrot-kpi/alpha-sdk'
import { Amount, Token } from '@carrot-kpi/sdk-core'
import { gql } from '@apollo/client'
import { useCarrotSubgraphClient } from './useCarrotSubgraphClient'
import { BigNumber } from '@ethersproject/bignumber'
import { DateTime } from 'luxon'
import { useActiveWeb3React } from './useActiveWeb3React'
import { getAddress } from '@ethersproject/address'

const KPI_TOKENS_QUERY = gql`
  query kpiTokens {
    kpiTokens(first: 1000) {
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
      if (!chainId || !carrotSubgraphClient) return

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

        // fetch all questions from IPFS/cache at once to boost performance
        const questionCids = kpiTokenData.kpiTokens.map((kpiToken) => {
          return kpiToken.oracleQuestion.text
        })
        let questions: { [cid: string]: string }
        try {
          questions = await Fetcher.fetchKpiTokenQuestions(questionCids)
        } catch (error) {
          console.error('could not fetch questions', error)
          if (!cancelled) setKpiTokens([])
          if (!cancelled) setLoading(false)
          return
        }

        const kpiTokens = (
          await Promise.all(
            kpiTokenData.kpiTokens.map(async (rawKpiToken) => {
              const collateralToken = new Token(
                chainId,
                getAddress(rawKpiToken.collateral.token.id),
                rawKpiToken.collateral.token.decimals,
                rawKpiToken.collateral.token.symbol,
                rawKpiToken.collateral.token.name
              )
              let question = ''
              try {
                const cid = rawKpiToken.oracleQuestion.text
                question =
                  cid === 'QmZka1df5eSj8bebFLxbp1dnNxZUm3vW1uA7meahV9r6Ci'
                    ? `# What will the average TVL for the COW token on Swapr Gnosis Chain be from Aug 4th 15:00 UTC to Sep 1st 15:00 UTC?
  
## Details
This campaign will pay out in the range of 150k USD to 400k USD, with no payout when the result is below 150k USD and increasing linear payout over the range with a full collateral payout when the result is 400k USD or higher.
        
## Calculating the final answer
The dedicated chart on the official carrot.eth frontend will show daily Swapr COW token TVL in the specified date range. Each bar represents a TVL reading taken each day at 15:00 UTC. To calculate the final result, use the data for each bar and calculate the average between all the charted values.`
                    : questions[cid] || rawKpiToken.oracleQuestion.text
                if (!question) {
                  console.warn(`could not fetch kpi token question with cid ${cid}`)
                  return
                }
                if (question.startsWith('# [TEST]')) return
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

        if (!cancelled) setKpiTokens(kpiTokens)
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
