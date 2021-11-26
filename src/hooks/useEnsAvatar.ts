import { useEffect, useState } from 'react'
import { IPFS_GATEWAY, MAINNET_PROVIDER } from '../constants'
import { CID } from 'multiformats'

export const useEnsAvatarUrl = (ensName?: string) => {
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!MAINNET_PROVIDER || !ensName) return
      if (!cancelled) setLoading(true)
      try {
        const response = await fetch(`https://metadata.ens.domains/mainnet/avatar/${ensName}/meta`)
        if (!response.ok) {
          console.error(`error fetching metadata for ens name ${ensName}`)
          return
        }
        const data = await response.json()
        if (!!!data.image) return
        if (data.image.startsWith('ipfs://ipfs/')) data.image = data.image.replace('ipfs://ipfs/', IPFS_GATEWAY)
        else if (data.image.startsWith('ipfs://')) data.image = data.image.replace('ipfs://', IPFS_GATEWAY)
        else if (data.image.startsWith('ipfs/')) data.image = data.image.replace('ipfs/', IPFS_GATEWAY)
        else if (CID.isCID(data.image)) data.image = `${IPFS_GATEWAY}${data.image}`
        if (!cancelled) setAvatarUrl(data.image)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [ensName])

  return { loading, avatarUrl }
}
