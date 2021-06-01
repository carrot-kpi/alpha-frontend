import { CARROT_SUBGRAPH_CLIENT } from '../constants'
import { ChainId } from 'carrot-sdk'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'

export function useCarrotSubgraphClient(): ApolloClient<NormalizedCacheObject> {
  const { chainId } = useWeb3React()

  return CARROT_SUBGRAPH_CLIENT[(chainId as ChainId) || ChainId.MAINNET]
}
