import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'

export const INFURA_PROJECT_ID = '0ebf4dd05d6740f482938b8a80860d13'

export const network = new NetworkConnector({
  urls: {
    1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    4: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  },
  defaultChainId: 1,
})

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4],
})
