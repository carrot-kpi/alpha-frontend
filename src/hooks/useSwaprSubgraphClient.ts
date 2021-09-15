import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from '@usedapp/core'
import { SWAPR_SUBGRAPH_CLIENT } from '../constants'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useSwaprSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useActiveWeb3React()

  return SWAPR_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.Mainnet]
}
