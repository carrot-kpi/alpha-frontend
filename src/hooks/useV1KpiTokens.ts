import { useEffect, useState } from 'react'
import { useActiveWeb3React } from './useActiveWeb3React'
import { Fetcher, KpiToken } from '@carrot-kpi/v1-sdk'

export function useV1KpiTokens(): { loading: boolean; kpiTokens: KpiToken[] } {
  const { chainId, library } = useActiveWeb3React()

  const [kpiTokens, setKpiTokens] = useState<KpiToken[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!chainId || !library) return

      if (!cancelled) setLoading(true)
      try {
        const fetchedKpiTokens = await Fetcher.fetchKpiTokens(chainId, library)
        if (!cancelled) setKpiTokens(fetchedKpiTokens)
        if (!cancelled) setLoading(false)
      } catch (error) {
        console.error(`error fetching kpi tokens`, error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [chainId, library])

  return { loading, kpiTokens }
}
