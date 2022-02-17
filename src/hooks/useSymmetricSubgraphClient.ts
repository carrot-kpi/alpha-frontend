import { SYMMETRIC_SUBGRAPH_CLIENT } from '../constants/graphql'
import { ChainId } from '@carrot-kpi/sdk'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useSymmetricSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useActiveWeb3React()

  return SYMMETRIC_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.GNOSIS] // FIXME: might want to change the default value to mainnet
}
