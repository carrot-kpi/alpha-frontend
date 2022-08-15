import { useEffect, useState } from 'react'
import { KpiToken, Fetcher } from '@carrot-kpi/v1-sdk'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useKpiToken(kpiTokenAddress?: string): { loading: boolean; kpiToken: KpiToken | null } {
  const { chainId, library } = useActiveWeb3React()

  const [kpiToken, setKpiToken] = useState<KpiToken | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      if (!chainId || !library || !kpiTokenAddress) return
      setLoading(true)
      try {
        const kpiToken = await Fetcher.fetchKpiToken(chainId, kpiTokenAddress, library)
        if (!cancelled) setKpiToken(kpiToken)
      } catch (error) {
        console.error(`error fetching kpi token at address ${kpiTokenAddress}`, error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [chainId, kpiTokenAddress, library])

  return { loading, kpiToken }
}
