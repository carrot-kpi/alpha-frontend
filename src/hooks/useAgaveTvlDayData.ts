import { gql } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { useAgaveSubgraphClient } from './useAgaveSubgraphClient'
import { useBlocksFromTimestamps } from './useBlocksFromTimestamps'
import { useETHPriceUSD } from './useETHPriceUSD'
import { Amount, Currency, Token } from '@carrot-kpi/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from './useActiveWeb3React'
import { getAddress } from '@ethersproject/address'
import { formatEther } from '@ethersproject/units'

interface Reserve {
  price: { priceInEth: string }
  decimals: number
  symbol: string
  name: string
  underlyingAsset: string
  totalLiquidity: string
}

interface QueryResponse {
  [timestampString: string]: { reserves: Reserve[] }[]
}

interface DayData {
  date: number
  tvlUSD: string
}

// FIXME: this can be optimized. Avoid performing a single request per block number and aggregate them in 1
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
  const { loading: loadingBlockNumbers, blocks } = useBlocksFromTimestamps(timestamps)
  const query = useMemo(() => {
    if (!blocks || blocks.length === 0) return undefined
    let queryString = 'query getHistoricalAgaveTvl {'
    queryString += blocks.map((block) => {
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
  }, [blocks])
  const ethPrice = useETHPriceUSD()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DayData[]>([])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!chainId || !query || loadingBlockNumbers || ethPrice.isZero()) {
        setData([])
        return
      }
      setLoading(true)
      try {
        const { data } = await agaveSubgraph.query<QueryResponse>({
          query,
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
                tvlUSD: formatEther(ethReserve.multiply(ethPrice).raw),
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
  }, [agaveSubgraph, chainId, ethPrice, loadingBlockNumbers, query, timestamps])

  return { loading, data }
}
