import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from '@carrot-kpi/sdk-core'

export const CARROT_SUBGRAPH_CLIENT: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/carrot-rinkeby',
    cache: new InMemoryCache(),
  }),
  [ChainId.GNOSIS]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/carrot-xdai',
    cache: new InMemoryCache(),
  }),
}

export const SWAPR_SUBGRAPH_CLIENT: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr-mainnet-v2',
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr-rinkeby-new',
    cache: new InMemoryCache(),
  }),
  [ChainId.GNOSIS]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr-xdai-v2',
    cache: new InMemoryCache(),
  }),
}

export const SYMMETRIC_SUBGRAPH_CLIENT: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.GNOSIS]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/centfinance/symmetric-xdai',
    cache: new InMemoryCache(),
  }),
}


export const BLOCK_SUBGRAPH_CLIENTS: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/alium-finance/mainnet-blocks',
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/rinkeby-blocks',
    cache: new InMemoryCache(),
  }),
  [ChainId.GNOSIS]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/1hive/xdai-blocks',
    cache: new InMemoryCache(),
  }),
}
