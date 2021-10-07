import { useEffect, useMemo, useState } from 'react'
import { gql } from '@apollo/client'
import { useBlocksSubgraphClient } from './useBlocksSubgraphClient'
import { ChainId } from '@carrot-kpi/sdk'

interface QueryResponse {
  [timestampString: string]: { number: string }[]
}

export function useBlocksFromTimestamps(
  timestamps: number[],
  chainIdOverride?: ChainId | number
): {
  loading: boolean
  blocks: { number: number; timestamp: number }[]
} {
  const [loading, setLoading] = useState(false)
  const [blocksFromTimestamps, setBlocksFromTimestamps] = useState<{ number: number; timestamp: number }[]>([])
  const query = useMemo(() => {
    if (!timestamps || timestamps.length === 0) return undefined
    let queryString = 'query blocks {'
    queryString += timestamps.map((timestamp) => {
      return `t${timestamp}: blocks(first: 1, where: { timestamp_gt: ${Math.floor(timestamp / 1000)} }) {
        number
      }`
    })
    queryString += '}'
    return gql(queryString)
  }, [timestamps])
  const blocksSubgraph = useBlocksSubgraphClient(chainIdOverride)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      if (!query) return
      setLoading(true)
      try {
        const { data } = await blocksSubgraph.query<QueryResponse>({ query })
        if (data && !cancelled)
          setBlocksFromTimestamps(
            Object.entries(data).reduce(
              (accumulator: { timestamp: number; number: number }[], [timestampString, blocks]) => {
                if (blocks.length > 0) {
                  accumulator.push({
                    timestamp: parseInt(timestampString.substring(1)),
                    number: parseInt(blocks[0].number),
                  })
                }
                return accumulator
              },
              []
            )
          )
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [blocksSubgraph, chainIdOverride, query, timestamps])

  return { loading, blocks: blocksFromTimestamps }
}
