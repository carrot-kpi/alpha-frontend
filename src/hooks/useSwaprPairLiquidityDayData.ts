import { gql } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useSwaprSubgraphClient } from './useSwaprSubgraphClient'
import { DateTime } from 'luxon'
import { Token } from '@usedapp/core'

const DAY_DATA_QUERY = gql`
  query getSwaprDayData($skip: Int!, $token0: ID!, $token1: ID!) {
    pairDayDatas(where: { token0: $token0, token1: $token1 }, first: 1000, skip: $skip) {
      date
      reserveUSD
    }
  }
`

export interface DayData {
  date: number
  reserveUSD: string
}

interface QueryResult {
  pairDayDatas: DayData[]
}

export const useSwaprPairLiquidityDayData = (token0?: Token, token1?: Token) => {
  const swaprSubgraph = useSwaprSubgraphClient()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DayData[]>([])

  useEffect(() => {
    const getPairChartData = async () => {
      if (!token0 || !token1) return
      setLoading(true)
      try {
        const data: DayData[] = []
        const utcEndTime = DateTime.utc()
        const utcStartTime = utcEndTime.minus({ year: 1 }).startOf('minute')
        const startTime = utcStartTime.toSeconds() - 1

        let allFound = false
        let skip = 0
        while (!allFound) {
          let result = await swaprSubgraph.query<QueryResult>({
            query: DAY_DATA_QUERY,
            variables: {
              token0: token0?.address.toLowerCase(),
              token1: token1?.address.toLowerCase(),
              skip,
            },
          })
          skip += 1000
          data.push(...result.data.pairDayDatas)
          if (result.data.pairDayDatas.length < 1000) {
            allFound = true
          }
        }

        const dayIndexSet = new Set()
        const dayIndexArray: DayData[] = []
        const oneDay = 24 * 60 * 60
        data.forEach((_, i) => {
          // add the day index to the set of days
          dayIndexSet.add((data[i].date / oneDay).toFixed(0))
          dayIndexArray.push(data[i])
        })

        if (data[0]) {
          // fill in empty days
          let timestamp = data[0].date ? data[0].date : startTime
          let latestLiquidityUSD = data[0].reserveUSD
          let index = 1
          while (timestamp < utcEndTime.toSeconds() - oneDay) {
            const nextDay = timestamp + oneDay
            let currentDayIndex = (nextDay / oneDay).toFixed(0)
            if (!dayIndexSet.has(currentDayIndex)) {
              data.push({
                date: nextDay,
                reserveUSD: latestLiquidityUSD,
              })
            } else {
              latestLiquidityUSD = dayIndexArray[index].reserveUSD
              index = index + 1
            }
            timestamp = nextDay
          }
        }
        setData(data.sort((a, b) => (a.date > b.date ? 1 : -1)))
      } catch (error) {
        console.error('error fetching swapr pair day data', error)
      } finally {
        setLoading(false)
      }
    }
    getPairChartData()
  }, [swaprSubgraph, token0, token1])

  return { loading, data }
}
