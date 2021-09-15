import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { NETWORK_CONTEXT_NAME } from '../constants'
import { ChainId, useEthers } from '@usedapp/core'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: ChainId } {
  const context = useEthers()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NETWORK_CONTEXT_NAME)
  return context.active ? context : contextNetwork
}
