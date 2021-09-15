import { ChainId } from '@usedapp/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const INFURA_PROJECT_ID = '0ebf4dd05d6740f482938b8a80860d13'

export const RPC_URL: {[chainId: number]: string} = {
  [ChainId.Mainnet]:  `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  [ChainId.Rinkeby]:  `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
} 

export const SUPPORTED_CHAINS = [ChainId.Mainnet, ChainId.Rinkeby]

export const network = new NetworkConnector({
  urls: {
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  },
  defaultChainId: ChainId.Rinkeby,
})

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAINS,
})

export const walletConnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAINS,
  rpc: {
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})