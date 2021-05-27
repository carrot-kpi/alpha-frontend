import { useEffect, ReactNode, ReactElement } from 'react'
import { useWeb3React } from '@web3-react/core'
import { network } from '../../connectors'

interface Web3ReactManagerProps {
  children: ReactNode
}

export default function Web3ReactManager({ children }: Web3ReactManagerProps): ReactElement {
  const { active, activate, error } = useWeb3React()

  useEffect(() => {
    if (!active && !error) {
      activate(network)
    }
  }, [active, error, activate])

  return <>{children}</>
}
