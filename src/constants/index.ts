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
    id: '0x646656003218c4a57ec2c0f1ed4834576d10dc92',
    kpiId: '0x6669d9ae3b027b7a262441b2851e6c1b8a8f3d5f82c222c34f9a07bac27ad5ea',
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
    id: '0x9f1d6b5be1c250d2345b5df7d19ae55ea274afbc',
    kpiId: '0x28e114a3abeb5f605dfd14e60e3fea274c7b3e8a48477309d36db331512620c9',
  },
]
