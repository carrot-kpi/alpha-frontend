import { ChainId } from '@carrot-kpi/sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const INFURA_PROJECT_ID = '0ebf4dd05d6740f482938b8a80860d13'

const RPC_URL: { [chainId in ChainId]: string } = {
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
}

const SUPPORTED_CHAINS = [ChainId.RINKEBY]

export const network = new NetworkConnector({
  urls: RPC_URL,
  defaultChainId: ChainId.RINKEBY,
})

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAINS,
})

export const walletConnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAINS,
  rpc: RPC_URL,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
})
