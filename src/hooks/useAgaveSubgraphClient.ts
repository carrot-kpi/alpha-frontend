import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from '@carrot-kpi/sdk'
import { AGAVE_SUBGRAPH_CLIENT } from '../constants'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useAgaveSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useActiveWeb3React()
  // FIXME: use mainnet as the fdefault indexing key
  return AGAVE_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.XDAI]
}
