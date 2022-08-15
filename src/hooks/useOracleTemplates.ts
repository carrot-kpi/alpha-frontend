import { useEffect, useState } from 'react'
import { Template, Fetcher } from '@carrot-kpi/v1-sdk'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useOracleTemplates(ids?: number[]): { loading: boolean; templates: Template[] } {
  const { chainId, library } = useActiveWeb3React()

  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      if (!chainId || !library) return
      setLoading(true)
      try {
        const templates = await Fetcher.fetchOracleTemplates(chainId, library, ids)
        if (!cancelled) setTemplates(templates)
      } catch (error) {
        console.error('error fetching oracle templates', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [chainId, library, ids])

  return { loading, templates }
}
