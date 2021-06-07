import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { ChainId, Currency, CurrencyAmount } from 'carrot-sdk'
import Decimal from 'decimal.js-light'
import { BigNumber } from 'ethers'

export const USD_CURRENCY = new Currency(BigNumber.from(18), '$', 'USD')
export const ZERO_USD = new CurrencyAmount(USD_CURRENCY, BigNumber.from(0))
export const ZERO_DECIMAL = new Decimal(0)

export const FEATURED_KPI_TOKENS = [
  '0x646656003218c4a57ec2c0f1ed4834576d10dc92',
  '0x9f1d6b5be1c250d2345b5df7d19ae55ea274afbc',
]
export const CREATORS_NAME_MAP: { [address: string]: string } = {
  '0xb4124ceb3451635dacedd11767f004d8a28c6ee7': 'Luzzif',
}

export const CARROT_SUBGRAPH_CLIENT: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  // this must be changed once on mainnet
  [ChainId.MAINNET]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/kpi-tokens-framework-rinkeby',
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/kpi-tokens-framework-rinkeby',
    cache: new InMemoryCache(),
  }),
}

export const SWAPR_SUBGRAPH_CLIENT: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr-mainnet-alpha',
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr_rinkeby',
    cache: new InMemoryCache(),
  }),
}
