import { ChainId, HONEYSWAP_SUBGRAPH_CLIENT } from '@carrot-kpi/sdk-core'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useHoneyswapSubgraphClient(): ApolloClient<NormalizedCacheObject> | undefined {
  const { chainId } = useActiveWeb3React()

  return HONEYSWAP_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.GNOSIS] // FIXME: might wat to change the default value to mainnet
}
