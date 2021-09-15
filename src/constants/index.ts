import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Amount, NATIVE_CURRENCY } from '@carrot-kpi/sdk'
import { ChainId, Token, FiatCurrency, Currency } from '@usedapp/core'
import Decimal from 'decimal.js-light'
import { BigNumber } from 'ethers'
import { injected, walletConnect } from '../connectors'
import metamaskLogo from '../assets/metamask-logo.webp'
import walletConnectLogo from '../assets/wallet-connect-logo.png'
import ethereumLogo from '../assets/ethereum-logo.png'
import { DateTime } from 'luxon'

export const USD_CURRENCY = new FiatCurrency('US dollar', 'USD', 18)
export const ZERO_USD = new Amount<Currency>(USD_CURRENCY, BigNumber.from(0))
export const ZERO_DECIMAL = new Decimal(0)

export const CREATORS_NAME_MAP: { [address: string]: string } = {
  '0xb4124ceb3451635dacedd11767f004d8a28c6ee7': 'Luzzif',
}

export const CARROT_SUBGRAPH_CLIENT: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  // this must be changed once on mainnet
  [ChainId.Mainnet]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/kpi-tokens-framework-rinkeby',
    cache: new InMemoryCache(),
  }),
  [ChainId.Rinkeby]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/kpi-tokens-framework-rinkeby',
    cache: new InMemoryCache(),
  }),
}

export const SWAPR_SUBGRAPH_CLIENT: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.Mainnet]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr-mainnet-alpha',
    cache: new InMemoryCache(),
  }),
  [ChainId.Rinkeby]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr_rinkeby',
    cache: new InMemoryCache(),
  }),
}

export const WEENUS = new Token('Weenus', 'WEENUS', ChainId.Rinkeby, '0xaff4481d10270f50f203e0763e2597776068cbc5', 18)
export const XEENUS = new Token('Xeenus', 'XEENUS', ChainId.Rinkeby, '0x022e292b44b5a146f2e8ee36ff44d3dd863c915c', 18)
export const ZEENUS = new Token('Zeenus', 'ZEENUS', ChainId.Rinkeby, '0x1f9061B953bBa0E36BF50F21876132DcF276fC6e', 18)
export const WBTC = new Token(
  'Wrapped Bitcoin',
  'WBTC',
  ChainId.Rinkeby,
  '0x577d296678535e4903d59a4c929b718e1d575e0a',
  18
)
export const WETH = new Token(
  'Wrapped Ether',
  'WETH',
  ChainId.Rinkeby,
  '0xc778417e063141139fce010982780140aa0cd5ab',
  18
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
  startDate: DateTime
  endDate: DateTime
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
    startDate: DateTime.fromSeconds(1631232000),
    endDate: DateTime.fromSeconds(1632096000),
    id: '0x613ef9212cb80d449f64ad7459961b532756e29b',
    kpiId: '0x260f29efbfb43d7f3189b747bcbaf10041b609c68a7462c058840d64c9fc1a87',
  },
  {
    platform: {
      type: SupportedPlatformType.DEX,
      specific: SpecificPlatform.SWAPR,
      specificData: {
        token0: ZEENUS,
        token1: WETH,
      },
    },
    startDate: DateTime.fromSeconds(1631232000),
    endDate: DateTime.fromSeconds(1632096000),
    id: '0xa49d50f044439c932fba143c985b170d40431082',
    kpiId: '0xa1836f64c67b7f28c0e361bcf1e2ecda58c956b2fb119be113bab60191b21160',
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
    startDate: DateTime.fromSeconds(1631232000),
    endDate: DateTime.fromSeconds(1632096000),
    id: '0x35b5e24a8849c47036a68bbb1ad3646ed3b42545',
    kpiId: '0xc0081e2b24608f482babb63bdce02d9a0c6824295bad60e27d9ab29d09d0e762',
  },
]

export interface WalletInfo {
  connector: AbstractConnector
  name: string
  icon: string
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    connector: injected,
    name: 'MetaMask',
    icon: metamaskLogo,
  },
  {
    connector: walletConnect,
    name: 'WalletConnect',
    icon: walletConnectLogo,
  },
]

export interface NetworkDetails {
  chainId: string
  chainName: string
  icon: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}

export const NETWORK_DETAIL: { [chainId: number]: NetworkDetails } = {
  [ChainId.Rinkeby]: {
    chainId: `0x${ChainId.Rinkeby.toString(16)}`,
    chainName: 'Rinkeby testnet',
    icon: ethereumLogo,
    nativeCurrency: {
      name: NATIVE_CURRENCY[ChainId.Rinkeby].name || 'Ether',
      symbol: NATIVE_CURRENCY[ChainId.Rinkeby].ticker || 'ETH',
      decimals: NATIVE_CURRENCY[ChainId.Rinkeby].decimals || 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
}

export const NETWORK_CONTEXT_NAME = 'NETWORK_CONTEXT'
