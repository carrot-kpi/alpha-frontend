import { JsonRpcProvider } from '@ethersproject/providers'
import { useEffect, useMemo, useState } from 'react'
import { RPC_URL } from '../connectors'

export const useEnsName = (account?: string) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const mainnetENSProvider = useMemo(() => new JsonRpcProvider(RPC_URL[1], 'mainnet'), [])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!mainnetENSProvider || !account) return
      if (!cancelled) setLoading(true)
      try {
        if (!cancelled) setName((await mainnetENSProvider.lookupAddress(account)) || '')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [account, mainnetENSProvider])

  return { loading, name }
}
