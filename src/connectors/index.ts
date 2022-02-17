import { ChainId } from '@carrot-kpi/sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from './custom-network'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const INFURA_PROJECT_ID = '0ebf4dd05d6740f482938b8a80860d13'
const POCKET_ID = '61d8970ca065f5003a112e86'

export const RPC_URL: { [chainId: number]: string } = {
  [ChainId.MAINNET]: `https://eth-mainnet.gateway.pokt.network/v1/lb/${POCKET_ID}`,
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  [ChainId.GNOSIS]: `https://poa-xdai.gateway.pokt.network/v1/lb/${POCKET_ID}`,
}

const SUPPORTED_CHAINS = [/* ChainId.MAINNET, */ ChainId.RINKEBY, ChainId.GNOSIS]

export const network = new NetworkConnector({
  urls: RPC_URL,
  defaultChainId: ChainId.GNOSIS,
})

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAINS,
})

export const walletConnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAINS,
  rpc: RPC_URL,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
})
