import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { App } from './pages/app'
import { store } from './state'
import { Config, DAppProvider } from '@usedapp/core'
import { RPC_URL, SUPPORTED_CHAINS } from './connectors'
import { createWeb3ReactRoot } from '@web3-react/core'
import { NETWORK_CONTEXT_NAME } from './constants'
import { Web3Provider } from '@ethersproject/providers'
import Web3ReactManager from './components/web3-manager'

const config: Config = {
  supportedChains: SUPPORTED_CHAINS,
  readOnlyUrls: RPC_URL,
}

const Web3ProviderNetwork = createWeb3ReactRoot(NETWORK_CONTEXT_NAME)

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider, 'any')
}

ReactDOM.render(
  <StrictMode>
    <DAppProvider config={config}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <HashRouter>
            <Web3ReactManager>
              <App />
            </Web3ReactManager>
          </HashRouter>
        </Provider>
      </Web3ProviderNetwork>
    </DAppProvider>
  </StrictMode>,
  document.getElementById('root')
)
