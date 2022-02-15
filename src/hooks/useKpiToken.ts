import { useEffect, useState } from 'react'
import { KpiToken, Amount, Token } from '@carrot-kpi/sdk'
import { gql } from '@apollo/client'
import { useCarrotSubgraphClient } from './useCarrotSubgraphClient'
import { BigNumber } from '@ethersproject/bignumber'
import { DateTime } from 'luxon'
import { useActiveWeb3React } from './useActiveWeb3React'
import { getAddress } from '@ethersproject/address'
import { CID } from 'multiformats/cid'
import {
  MOCHI_TEST_KPI_TOKEN,
  SWAPR_GNO_TEST_KPI_TOKEN,
  SWAPR_SWPR_TEST_KPI_TOKEN,
  HOPR_TEST_KPI_TOKEN,
  DAPPNODE_TEST_KPI_TOKEN_1,
  DAPPNODE_TEST_KPI_TOKEN_2,
  DAPPNODE_TEST_KPI_TOKEN_3,
} from '../constants/tokens'

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

export function useKpiToken(kpiId?: string): { loading: boolean; kpiToken?: KpiToken } {
  const { chainId } = useActiveWeb3React()
  const carrotSubgraphClient = useCarrotSubgraphClient()

  const [kpiToken, setKpiToken] = useState<KpiToken | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!chainId || !kpiId) return

      if (!cancelled) setLoading(true)
      try {
        // TODO: remove this, as it is for test purposes only!
        if (kpiId === MOCHI_TEST_KPI_TOKEN.kpiId) {
          setKpiToken(MOCHI_TEST_KPI_TOKEN)
          return
        }
        if (kpiId === SWAPR_SWPR_TEST_KPI_TOKEN.kpiId) {
          setKpiToken(SWAPR_SWPR_TEST_KPI_TOKEN)
          return
        }
        if (kpiId === SWAPR_GNO_TEST_KPI_TOKEN.kpiId) {
          setKpiToken(SWAPR_GNO_TEST_KPI_TOKEN)
          return
        }
        if (kpiId === HOPR_TEST_KPI_TOKEN.kpiId) {
          setKpiToken(HOPR_TEST_KPI_TOKEN)
          return
        }
        if (kpiId === DAPPNODE_TEST_KPI_TOKEN_1.kpiId) {
          setKpiToken(DAPPNODE_TEST_KPI_TOKEN_1)
          return
        }
        if (kpiId === DAPPNODE_TEST_KPI_TOKEN_2.kpiId) {
          setKpiToken(DAPPNODE_TEST_KPI_TOKEN_2)
          return
        }
        if (kpiId === DAPPNODE_TEST_KPI_TOKEN_3.kpiId) {
          setKpiToken(DAPPNODE_TEST_KPI_TOKEN_3)
          return
        }

        const { data: kpiTokenData } = await carrotSubgraphClient.query<CarrotQueryResult>({
          query: KPI_TOKEN_QUERY,
          variables: { kpiId },
        })
        if (!kpiTokenData.kpiTokens || kpiTokenData.kpiTokens.length !== 1) {
          if (!cancelled) setLoading(false)
          if (!cancelled) setKpiToken(undefined)
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
        let question = rawKpiToken.oracleQuestion.text
        try {
          const cid = CID.parse(question)
          const response = await fetch(`https://ipfs.io/ipfs/${cid.toV0()}`)
          if (!response.ok) {
            console.warn('could not load question from ipfs')
            return
          }
          question = await response.text()
        } catch (error) {
          // not a cid
        }
        const kpiToken = new KpiToken(
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
        if (!cancelled) {
          setKpiToken(kpiToken)
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
  }, [carrotSubgraphClient, chainId, kpiId])

  return { loading, kpiToken }
}
