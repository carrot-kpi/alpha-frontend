import { useEthers } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { injected } from '../connectors'
import { useIsMobile } from './useIsMobile'

export function useEagerConnect() {
  const { activate, active } = useEthers() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        if (isMobile && window.ethereum) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      }
    })
  }, [activate, isMobile]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}
