import { useEffect, useState } from 'react'
import { MAINNET_PROVIDER } from '../constants'

export const useEnsName = (account?: string) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!MAINNET_PROVIDER || !account) return
      if (!cancelled) setLoading(true)
      try {
        if (!cancelled) setName((await MAINNET_PROVIDER.lookupAddress(account)) || '')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [account])

  return { loading, name }
}
