import { AbstractConnector } from '@web3-react/abstract-connector'
import { Amount, ChainId, Currency } from '@carrot-kpi/sdk'
import Decimal from 'decimal.js-light'
import { BigNumber } from '@ethersproject/bignumber'
import { injected, RPC_URL, walletConnect } from '../connectors'
import metamaskLogo from '../assets/metamask-logo.webp'
import walletConnectLogo from '../assets/wallet-connect-logo.png'
import ethereumLogo from '../assets/ethereum-logo.png'
import xDaiLogo from '../assets/svgs/xdai-logo.svg'
import { parseUnits } from '@ethersproject/units'
import { JsonRpcProvider } from '@ethersproject/providers'

export const ZERO_USD = new Amount<Currency>(Currency.USD, BigNumber.from(0))
export const ZERO_DECIMAL = new Decimal(0)

export const CREATORS_NAME_MAP: { [address: string]: string } = {
  '0xb4124ceb3451635dacedd11767f004d8a28c6ee7': 'Luzzif',
  '0x9467dcfd4519287e3878c018c02f5670465a9003': 'DXdao',
}
export const INVALID_REALITY_ANSWER = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
)

export interface WalletInfo {
  connector: AbstractConnector
  name: string
  icon: string
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    connector: walletConnect,
    name: 'WalletConnect',
    icon: walletConnectLogo,
  },
]
if (window.ethereum) {
  SUPPORTED_WALLETS.push({
    connector: injected,
    name: 'MetaMask',
    icon: metamaskLogo,
  })
}

export interface NetworkDetails {
  chainId: string
  chainName: string
  icon: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  defaultBond: BigNumber
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
}

export const NETWORK_DETAIL: { [chainId: number]: NetworkDetails } = {
  [ChainId.XDAI]: {
    chainId: `0x${Number(100).toString(16)}`,
    chainName: 'xDai',
    icon: xDaiLogo,
    nativeCurrency: {
      name: 'xDai',
      symbol: 'xDAI',
      decimals: 18,
    },
    defaultBond: parseUnits('10', 18),
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
  },
}
if (process.env.NODE_ENV !== 'production') {
  NETWORK_DETAIL[ChainId.RINKEBY] = {
    chainId: `0x${ChainId.RINKEBY.toString(16)}`,
    chainName: 'Rinkeby',
    icon: ethereumLogo,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    defaultBond: parseUnits('0.1', 18),
    rpcUrls: ['https://rinkeby.infura.io/v3'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  }
}

export const NETWORK_CONTEXT_NAME = 'NETWORK_CONTEXT'

export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'

export const MAINNET_PROVIDER = new JsonRpcProvider(RPC_URL[1], 'mainnet')
