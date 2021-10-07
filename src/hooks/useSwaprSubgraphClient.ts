import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from '@carrot-kpi/sdk'
import { SWAPR_SUBGRAPH_CLIENT } from '../constants/apollo'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useSwaprSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useActiveWeb3React()
  // FIXME: use mainnet as the fdefault indexing key
  return SWAPR_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.XDAI]
}
