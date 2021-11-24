import { SWAPR_SUBGRAPH_CLIENT } from '../constants/graphql'
import { ChainId } from '@carrot-kpi/sdk'
import { GraphQLClient } from 'graphql-request'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useSwaprSubgraphClient(): GraphQLClient {
  const { chainId } = useActiveWeb3React()

  return SWAPR_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.XDAI] // FIXME: might wat to change the default value to mainnet
}
