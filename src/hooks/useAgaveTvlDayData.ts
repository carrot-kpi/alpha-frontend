import { gql } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { useAgaveSubgraphClient } from './useAgaveSubgraphClient'
import { useBlocksFromTimestamps } from './useBlocksFromTimestamps'
import { Amount, Currency, Token } from '@carrot-kpi/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from './useActiveWeb3React'
import { getAddress } from '@ethersproject/address'
import { parseEther } from '@ethersproject/units'
import Decimal from 'decimal.js-light'
import { useSwaprSubgraphClient } from './useSwaprSubgraphClient'

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

interface HistoricalNativeCurrencyPriceQueryResponse {
  [timestampString: string]: { nativeCurrencyPrice: string }
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
  const swaprSubgraph = useSwaprSubgraphClient()
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
  const historicalNativeCurrencyPriceUSDQuery = useMemo(() => {
    if (!tvlDataBlocks || tvlDataBlocks.length === 0) return undefined
    let queryString = 'query getHistoricalNativeCurrencyPrice {'
    queryString += tvlDataBlocks.map((block) => {
      return `t${block.timestamp}: bundle(id: 1, block: { number: ${block.number} }) {
        nativeCurrencyPrice
      }`
    })
    queryString += '}'
    return gql(queryString)
  }, [tvlDataBlocks])

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DayData[]>([])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!chainId || !reservesQuery || !historicalNativeCurrencyPriceUSDQuery || loadingTvlDataBlockNumbers) {
        setLoading(true)
        setData([])
        return
      }
      setLoading(true)
      try {
        const { data: historicalNativeCurrencyPriceData } =
          await swaprSubgraph.query<HistoricalNativeCurrencyPriceQueryResponse>({
            query: historicalNativeCurrencyPriceUSDQuery,
          })

        const { data } = await agaveSubgraph.query<DayDataQueryResponse>({
          query: reservesQuery,
        })
        if (!cancelled) {
          setData(
            Object.entries(data).reduce((dayDatas: DayData[], [timestampString, wrappedReserves]) => {
              const ethReserve = wrappedReserves.reduce<Amount<Currency>>((ethTvl, { reserves }) => {
                const reserveLiquidityEth = reserves.reduce((reserveLiquidity: Amount<Currency>, reserve) => {
                  const totalLiquidityBn = BigNumber.from(reserve.totalLiquidity)
                  if (totalLiquidityBn.isZero()) return reserveLiquidity
                  const reserveAmount = new Amount(
                    new Token(
                      chainId,
                      getAddress(reserve.underlyingAsset),
                      reserve.decimals,
                      reserve.symbol,
                      reserve.name
                    ),
                    totalLiquidityBn
                  )
                  const tokenNativeCurrencyPrice = new Amount(Currency.ETHER, BigNumber.from(reserve.price.priceInEth))
                  return reserveLiquidity.plus(reserveAmount.multiply(tokenNativeCurrencyPrice))
                }, new Amount(Currency.ETHER, BigNumber.from('0')))
                return ethTvl.plus(reserveLiquidityEth)
              }, new Amount(Currency.ETHER, BigNumber.from('0')))

              dayDatas.push({
                date: Math.floor(parseInt(timestampString.substring(1)) / 1000),
                tvlUSD: ethReserve
                  .multiply(
                    new Amount(
                      Currency.ETHER,
                      parseEther(
                        new Decimal(historicalNativeCurrencyPriceData[timestampString].nativeCurrencyPrice).toFixed(18)
                      )
                    )
                  )
                  .toFixed(2),
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
    swaprSubgraph,
    chainId,
    historicalNativeCurrencyPriceUSDQuery,
    loadingTvlDataBlockNumbers,
    reservesQuery,
    timestamps,
  ])

  return { loading, data }
}
