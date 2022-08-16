import { ChainId } from '@carrot-kpi/sdk-core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from './custom-network'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const INFURA_PROJECT_ID = '0ebf4dd05d6740f482938b8a80860d13'
const POCKET_ID = '61d8970ca065f5003a112e86'

export const RPC_URL: Record<ChainId, string> = {
  [ChainId.MAINNET]: `https://eth-mainnet.gateway.pokt.network/v1/lb/${POCKET_ID}`,
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  [ChainId.GOERLI]: `https://eth-goerli.gateway.pokt.network/v1/lb/${POCKET_ID}`,
  [ChainId.GNOSIS]: `https://poa-xdai.gateway.pokt.network/v1/lb/${POCKET_ID}`,
}

const SUPPORTED_CHAINS = [ChainId.MAINNET, ChainId.RINKEBY, ChainId.GNOSIS, ChainId.GOERLI]

export const network = new NetworkConnector({
  urls: RPC_URL,
  defaultChainId: ChainId.GOERLI,
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
