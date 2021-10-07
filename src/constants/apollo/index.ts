import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from '@carrot-kpi/sdk'

export const CARROT_SUBGRAPH_CLIENT: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/carrot-rinkeby',
    cache: new InMemoryCache(),
  }),
  [ChainId.XDAI]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/carrot-xdai',
    cache: new InMemoryCache(),
  }),
}

export const SWAPR_SUBGRAPH_CLIENT: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr_rinkeby',
    cache: new InMemoryCache(),
  }),
  [ChainId.XDAI]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr-xdai',
    cache: new InMemoryCache(),
  }),
}

export const AGAVE_SUBGRAPH_CLIENT: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/pjcolombo/agave-rinkeby',
    cache: new InMemoryCache(),
  }),
  [ChainId.XDAI]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/agave-dao/agave-xdai',
    cache: new InMemoryCache(),
  }),
}

// FIXME: replace with ChainId when mainnet will be there
export const BLOCK_SUBGRAPH_CLIENTS: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  1: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/rinkeby-blocks',
    cache: new InMemoryCache(),
  }),
  [ChainId.XDAI]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/1hive/xdai-blocks',
    cache: new InMemoryCache(),
  }),
}

export const UNISWAP_V2_MAINNET_SUBGRAPH_CLIENT = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  cache: new InMemoryCache(),
})
