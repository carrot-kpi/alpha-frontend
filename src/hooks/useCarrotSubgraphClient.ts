import { CARROT_SUBGRAPH_CLIENT } from '../constants'
import { ChainId } from '@usedapp/core'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useCarrotSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useActiveWeb3React()

  return CARROT_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.Mainnet]
}
