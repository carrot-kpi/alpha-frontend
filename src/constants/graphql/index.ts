import { GraphQLClient } from 'graphql-request'
import { ChainId } from '@carrot-kpi/sdk'

export const CARROT_SUBGRAPH_CLIENT: { [chainId in ChainId]: GraphQLClient } = {
  [ChainId.RINKEBY]: new GraphQLClient('https://api.thegraph.com/subgraphs/name/luzzif/carrot-rinkeby'),
  [ChainId.XDAI]: new GraphQLClient('https://api.thegraph.com/subgraphs/name/luzzif/carrot-xdai'),
}

export const SWAPR_SUBGRAPH_CLIENT: { [chainId in ChainId]: GraphQLClient } = {
  [ChainId.RINKEBY]: new GraphQLClient('https://api.thegraph.com/subgraphs/name/luzzif/swapr_rinkeby'),
  [ChainId.XDAI]: new GraphQLClient('https://api.thegraph.com/subgraphs/name/luzzif/swapr-xdai'),
}

export const HONEYSWAP_SUBGRAPH_CLIENT: { [chainId: number]: GraphQLClient } = {
  [ChainId.XDAI]: new GraphQLClient('https://api.thegraph.com/subgraphs/name/1hive/honeyswap-v2'),
}

export const AGAVE_SUBGRAPH_CLIENT: { [chainId in ChainId]: GraphQLClient } = {
  [ChainId.RINKEBY]: new GraphQLClient('https://api.thegraph.com/subgraphs/name/pjcolombo/agave-rinkeby'),
  [ChainId.XDAI]: new GraphQLClient('https://api.thegraph.com/subgraphs/name/agave-dao/agave-xdai'),
}

export const BLOCK_SUBGRAPH_CLIENTS: { [chainId in ChainId]: GraphQLClient } = {
  [ChainId.RINKEBY]: new GraphQLClient('https://api.thegraph.com/subgraphs/name/blocklytics/rinkeby-blocks'),
  [ChainId.XDAI]: new GraphQLClient('https://api.thegraph.com/subgraphs/name/1hive/xdai-blocks'),
}
