import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Amount, ChainId, Currency, Token } from '@carrot-kpi/sdk'
import Decimal from 'decimal.js-light'
import { BigNumber } from '@ethersproject/bignumber'
import { injected, walletConnect } from '../connectors'
import metamaskLogo from '../assets/metamask-logo.webp'
import walletConnectLogo from '../assets/wallet-connect-logo.png'
import ethereumLogo from '../assets/ethereum-logo.png'
// import xDaiLogo from '../assets/svgs/xdai-logo.svg'
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
  specificData?: DexSpecificData | LendingSpecificData
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
    },
    startDate: DateTime.fromSeconds(0),
    endDate: DateTime.fromSeconds(1632960000),
    id: '0x2e56fcdf03224f517ecad56e97469946cebcf713',
    kpiId: '0xbea91af71aec36944621c30866b22513c56237198c178131be2f094260c2ca68',
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
  /* 100: {
    chainId: `0x${Number(100).toString(16)}`,
    chainName: 'xDai',
    icon: xDaiLogo,
    nativeCurrency: {
      name: 'xDai',
      symbol: 'xDAI',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
  }, */
}

export const NETWORK_CONTEXT_NAME = 'NETWORK_CONTEXT'
