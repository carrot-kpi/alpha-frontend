import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useIsDarkMode, useToggleDarkMode } from './hooks'

export function UserUpdater(): null {
  const { chainId, connector } = useWeb3React()
  const location = useLocation()
  const toggleDarkMode = useToggleDarkMode()
  const darkMode = useIsDarkMode()

  useEffect(() => {
    if (!chainId || !location || !connector) return
    const searchParams = new URLSearchParams(location.search)
    const requiredTheme = searchParams.get('theme')
    if (
      (darkMode && requiredTheme?.toLowerCase() === 'light') ||
      (!darkMode && requiredTheme?.toLowerCase() === 'dark')
    )
      toggleDarkMode()
  }, [chainId, connector, darkMode, location, toggleDarkMode])

  return null
}
