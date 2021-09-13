import { CARROT_SUBGRAPH_CLIENT } from '../constants'
import { ChainId } from '@usedapp/core'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useEthers } from '@usedapp/core'

export function useCarrotSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useEthers()

  return CARROT_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.Mainnet]
}
