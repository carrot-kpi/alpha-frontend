import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from 'carrot-sdk'
import { SWAPR_SUBGRAPH_CLIENT } from '../constants'

export function useSwaprSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useWeb3React()

  return SWAPR_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.MAINNET]
}
