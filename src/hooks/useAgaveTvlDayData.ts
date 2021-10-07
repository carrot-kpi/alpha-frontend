import { gql } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { useAgaveSubgraphClient } from './useAgaveSubgraphClient'
import { useBlocksFromTimestamps } from './useBlocksFromTimestamps'
import { Amount, Currency, Token } from '@carrot-kpi/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from './useActiveWeb3React'
import { getAddress } from '@ethersproject/address'
import { formatEther, parseEther } from '@ethersproject/units'
import { UNISWAP_V2_MAINNET_SUBGRAPH_CLIENT } from '../constants/apollo'
import Decimal from 'decimal.js-light'

interface Reserve {
  price: { priceInEth: string }
  decimals: number
  symbol: string
  name: string
  underlyingAsset: string
  totalLiquidity: string
}

interface DayDataQueryResponse {
  [timestampString: string]: { reserves: Reserve[] }[]
}

interface HistoricalEthPriceQueryResponse {
  [timestampString: string]: { ethPrice: string }
}

interface DayData {
  date: number
  tvlUSD: string
}

export const useAgaveTvlDayData = (
  startDate = DateTime.now().minus({ days: 30 }).endOf('day'),
  endDate = DateTime.now().startOf('day')
) => {
  const { chainId } = useActiveWeb3React()
  const agaveSubgraph = useAgaveSubgraphClient()
  const timestamps = useMemo(() => {
    let loopedDate = startDate.endOf('day')
    const normalizedEndDate = endDate.startOf('day')
    let timestamps = []
    while (loopedDate.toMillis() < normalizedEndDate.toMillis()) {
      timestamps.push(loopedDate.toMillis())
      loopedDate = loopedDate.plus({ day: 1 })
    }
    return timestamps
  }, [endDate, startDate])
  const { loading: loadingTvlDataBlockNumbers, blocks: tvlDataBlocks } = useBlocksFromTimestamps(timestamps)
  const { loading: loadingHistoricalEthPriceBlockNumbers, blocks: historicalEthPriceBlocks } = useBlocksFromTimestamps(
    timestamps,
    1 // FIXME: replace with mainnet once it's there
  )
  const reservesQuery = useMemo(() => {
    if (!tvlDataBlocks || tvlDataBlocks.length === 0) return undefined
    let queryString = 'query getHistoricalAgaveTvl {'
    queryString += tvlDataBlocks.map((block) => {
      return `t${block.timestamp}: pools(block: { number: ${block.number} }) {
        reserves(where: { totalLiquidity_gt: 0 }) {
          price {
            priceInEth
          }
          decimals
          name
          symbol
          underlyingAsset
          totalLiquidity
        }
      }`
    })
    queryString += '}'
    return gql(queryString)
  }, [tvlDataBlocks])
  const historicalEthPriceUSDQuery = useMemo(() => {
    if (!historicalEthPriceBlocks || historicalEthPriceBlocks.length === 0) return undefined
    let queryString = 'query getHistoricalEthPrice {'
    queryString += historicalEthPriceBlocks.map((block) => {
      return `t${block.timestamp}: bundle(id: 1, block: { number: ${block.number} }) {
        ethPrice
      }`
    })
    queryString += '}'
    return gql(queryString)
  }, [historicalEthPriceBlocks])

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DayData[]>([])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (
        !chainId ||
        !reservesQuery ||
        !historicalEthPriceUSDQuery ||
        loadingTvlDataBlockNumbers ||
        loadingHistoricalEthPriceBlockNumbers
      ) {
        setLoading(true)
        setData([])
        return
      }
      setLoading(true)
      try {
        const { data: historicalEthPriceData } =
          await UNISWAP_V2_MAINNET_SUBGRAPH_CLIENT.query<HistoricalEthPriceQueryResponse>({
            query: historicalEthPriceUSDQuery,
          })

        const { data } = await agaveSubgraph.query<DayDataQueryResponse>({
          query: reservesQuery,
        })
        if (!cancelled) {
          setData(
            Object.entries(data).reduce((dayDatas: DayData[], [timestampString, wrappedReserves]) => {
              const ethReserve = wrappedReserves.reduce<Amount<Currency>>((ethTvl, { reserves }) => {
                const reserveLiquidityEth = reserves.reduce((reserveLiquidity: Amount<Currency>, reserve) => {
                  const tokenEthPrice = new Amount(Currency.ETHER, BigNumber.from(reserve.price.priceInEth))
                  const reserveAmount = new Amount(
                    new Token(
                      chainId,
                      getAddress(reserve.underlyingAsset),
                      reserve.decimals,
                      reserve.symbol,
                      reserve.name
                    ),
                    BigNumber.from(reserve.totalLiquidity)
                  )
                  return reserveLiquidity.plus(reserveAmount.multiply(tokenEthPrice))
                }, new Amount(Currency.ETHER, BigNumber.from('0')))
                return ethTvl.plus(reserveLiquidityEth)
              }, new Amount(Currency.ETHER, BigNumber.from('0')))

              dayDatas.push({
                date: Math.floor(parseInt(timestampString.substring(1)) / 1000),
                tvlUSD: formatEther(
                  ethReserve.multiply(
                    new Amount(
                      Currency.ETHER,
                      parseEther(new Decimal(historicalEthPriceData[timestampString].ethPrice).toFixed(18))
                    )
                  ).raw
                ),
              })
              return dayDatas
            }, [])
          )
        }
      } catch (error) {
        console.error('error fetching agave tvl day data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [
    agaveSubgraph,
    chainId,
    historicalEthPriceUSDQuery,
    loadingHistoricalEthPriceBlockNumbers,
    loadingTvlDataBlockNumbers,
    reservesQuery,
    timestamps,
  ])

  return { loading, data }
}
