import { useEffect, useState } from 'react'
import { KpiToken, Fetcher } from '@carrot-kpi/v1-sdk'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useKpiTokens(): { loading: boolean; kpiTokens?: KpiToken[] } {
  const { chainId, library } = useActiveWeb3React()

  const [kpiTokens, setKpiTokens] = useState<KpiToken[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      if (!chainId || !library) return
      setLoading(true)
      try {
        const kpiTokens = await Fetcher.fetchKpiTokens(chainId, library)
        if (!cancelled) setKpiTokens(kpiTokens)
      } catch (error) {
        console.error('error fetching kpi tokens', error)
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
