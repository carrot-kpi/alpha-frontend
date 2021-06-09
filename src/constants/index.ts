import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { ChainId, Currency, CurrencyAmount, Token } from 'carrot-sdk'
import Decimal from 'decimal.js-light'
import { BigNumber } from 'ethers'

export const USD_CURRENCY = new Currency(BigNumber.from(18), '$', 'USD')
export const ZERO_USD = new CurrencyAmount(USD_CURRENCY, BigNumber.from(0))
export const ZERO_DECIMAL = new Decimal(0)

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

export const WEENUS = new Token(
  ChainId.RINKEBY,
  '0xaff4481d10270f50f203e0763e2597776068cbc5',
  BigNumber.from(18),
  'WEENUS',
  'WEENUS'
)
export const XEENUS = new Token(
  ChainId.RINKEBY,
  '0x022e292b44b5a146f2e8ee36ff44d3dd863c915c',
  BigNumber.from(18),
  'XEENUS',
  'XEENUS'
)
export const WBTC = new Token(
  ChainId.RINKEBY,
  '0x577d296678535e4903d59a4c929b718e1d575e0a',
  BigNumber.from(18),
  'WBTC',
  'WBTC'
)
export const WETH = new Token(
  ChainId.RINKEBY,
  '0xc778417e063141139fce010982780140aa0cd5ab',
  BigNumber.from(18),
  'WETH',
  'WETH'
)

export enum SupportedPlatformType {
  DEX,
  LENDING,
}

export enum SpecificPlatform {
  SWAPR,
  AGAVE,
}

export interface DexSpecificData {
  token0: Token
  token1: Token
}

export interface LendingSpecificData {
  token: Token
}

interface SupportedPlatform {
  type: SupportedPlatformType
  specific: SpecificPlatform
  specificData: DexSpecificData | LendingSpecificData
}

interface FeaturedCampaign {
  platform: SupportedPlatform
  id: string
  kpiId: string
}

export const FEATURED_CAMPAIGNS: FeaturedCampaign[] = [
  {
    platform: {
      type: SupportedPlatformType.DEX,
      specific: SpecificPlatform.SWAPR,
      specificData: {
        token0: WEENUS,
        token1: WETH,
      },
    },
    id: '0x34ef922c049d581af050d2e28d93c6367ee045f8',
    kpiId: '0x293990e87ac8c4a0fe568fc80e8256baacefde632a0b40142a7071786bc1b360',
  },
  {
    platform: {
      type: SupportedPlatformType.DEX,
      specific: SpecificPlatform.SWAPR,
      specificData: {
        token0: XEENUS,
        token1: WETH,
      },
    },
    id: '0xa4965ca891158608a64e6d7e512e3eabcfb7a1eb',
    kpiId: '0x874f88bf3510fef21f6b1aef2b3a9e4093c906fa92fc098492feae5863517cc5',
  },
  {
    platform: {
      type: SupportedPlatformType.DEX,
      specific: SpecificPlatform.SWAPR,
      specificData: {
        token0: WBTC,
        token1: WETH,
      },
    },
    id: '0xf41800ebe4dac76031f21dfb10eb4187da6ae216',
    kpiId: '0x5a79ec8881f7190c0d526a7eae5b4a13915efc3fb891b6cc48f4ad0b15afe1d7',
  },
]
