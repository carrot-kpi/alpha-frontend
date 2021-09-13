import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { ChainId } from '@usedapp/core'
import { SWAPR_SUBGRAPH_CLIENT } from '../constants'

export function useSwaprSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useEthers()

  return SWAPR_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.Mainnet]
}
