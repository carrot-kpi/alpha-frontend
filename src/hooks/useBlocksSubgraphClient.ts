import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from '@carrot-kpi/sdk'
import { BLOCK_SUBGRAPH_CLIENTS } from '../constants/apollo'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useBlocksSubgraphClient(chainIdOverride?: ChainId): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useActiveWeb3React()
  // FIXME: use mainnet as the default indexing key
  return BLOCK_SUBGRAPH_CLIENTS[chainIdOverride || (chainId as ChainId) || ChainId.XDAI]
}
