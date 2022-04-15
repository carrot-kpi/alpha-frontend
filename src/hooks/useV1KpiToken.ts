import { useEffect, useState } from 'react'
import { useActiveWeb3React } from './useActiveWeb3React'
import { Fetcher, KpiToken } from '@carrot-kpi/v1-sdk'

export function useV1KpiToken(address?: string): { loading: boolean; kpiToken?: KpiToken } {
  const { chainId, library } = useActiveWeb3React()

  const [kpiToken, setKpiToken] = useState<KpiToken | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!chainId || !library || !address) return

      if (!cancelled) setLoading(true)
      try {
        const fetchedKpiToken = await Fetcher.fetchKpiToken(chainId, address, library)
        if (!cancelled) setKpiToken(fetchedKpiToken)
        if (!cancelled) setLoading(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [address, chainId, library])

  return { loading, kpiToken }
}
