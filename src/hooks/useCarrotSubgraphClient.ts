import { CARROT_SUBGRAPH_CLIENT } from '../constants/graphql'
import { ChainId } from '@carrot-kpi/sdk-core'
import { useActiveWeb3React } from './useActiveWeb3React'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

export function useCarrotSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useActiveWeb3React()

  return CARROT_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.GNOSIS] // FIXME: might wat to change the default value to mainnet
}
