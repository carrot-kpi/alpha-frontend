import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Amount, ChainId, Currency, Token } from '@carrot-kpi/sdk'
import Decimal from 'decimal.js-light'
import { BigNumber } from '@ethersproject/bignumber'
import { injected, walletConnect } from '../connectors'
import metamaskLogo from '../assets/metamask-logo.webp'
import walletConnectLogo from '../assets/wallet-connect-logo.png'
import ethereumLogo from '../assets/ethereum-logo.png'
import { DateTime } from 'luxon'

export const ZERO_USD = new Amount<Currency>(Currency.USD, BigNumber.from(0))
export const ZERO_DECIMAL = new Decimal(0)

export const CREATORS_NAME_MAP: { [address: string]: string } = {
  '0xb4124ceb3451635dacedd11767f004d8a28c6ee7': 'Luzzif',
}

export const CARROT_SUBGRAPH_CLIENT: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/kpi-tokens-framework-rinkeby',
    cache: new InMemoryCache(),
  }),
}

export const SWAPR_SUBGRAPH_CLIENT: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr_rinkeby',
    cache: new InMemoryCache(),
  }),
}

export const WEENUS = new Token(ChainId.RINKEBY, '0xaFF4481D10270F50f203E0763e2597776068CBc5', 18, 'WEENUS', 'Weenus')
export const XEENUS = new Token(ChainId.RINKEBY, '0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c', 18, 'XEENUS', 'Xeenus')
export const ZEENUS = new Token(ChainId.RINKEBY, '0x1f9061B953bBa0E36BF50F21876132DcF276fC6e', 18, 'ZEENUS', 'Zeenus')
export const WBTC = new Token(
  ChainId.RINKEBY,
  '0x577D296678535e4903D59A4C929B718e1D575e0A',
  18,
  'WBTC',
  'Wrapped Bitcoin'
)
export const WETH = new Token(
  ChainId.RINKEBY,
  '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  18,
  'WETH',
  'Wrapped Ether'
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
    startDate: DateTime.fromSeconds(0),
    endDate: DateTime.fromSeconds(1632960000),
    id: '0x4aea914e70db869b2e7dda8db7f107e8804b61ab',
    kpiId: '0x8931cd8e45e12cfabd3ae5f105e585cf19ca446615d6fce746cf3f1ee08f5944',
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
  [ChainId.RINKEBY]: {
    chainId: `0x${ChainId.RINKEBY.toString(16)}`,
    chainName: 'Rinkeby testnet',
    icon: ethereumLogo,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.infura.io/v3'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  },
}

export const NETWORK_CONTEXT_NAME = 'NETWORK_CONTEXT'
