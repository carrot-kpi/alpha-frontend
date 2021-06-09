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
    id: '0xc03f3f7c211d155fa6f8df86f89ec8363fdc1928',
    kpiId: '0x84717ede0d431e27ae706683ba9f4754f5ea0a75a18476b0587cccd5bfb1f4b1',
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
    id: '0x87f2d2b2926c38684d0e47debe9a7ecd88be21f9',
    kpiId: '0x0e4439bbfdfc64bf60712f9990faa10431b7171139590437bc7b376b681b63b2',
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
    id: '0x3d026efd73b1d37fb4194fcadb53e9938fc99279',
    kpiId: '0xea064d3549e44c2c455cd99b19a919e8c9693b77730a60922cad5882a3cb8637',
  },
]
