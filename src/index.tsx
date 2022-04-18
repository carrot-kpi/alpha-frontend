import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { App } from './pages/app'
import { store } from './state'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { NETWORK_CONTEXT_NAME } from './constants'
import { Web3Provider } from '@ethersproject/providers'
import Web3ReactManager from './components/web3-manager'
import { ApplicationStateUpdater } from './state/application/updater'
import { MulticallStateUpdater } from './state/multicall/updater'
import { MultiChainLinksUpdater } from './state/multi-chain-links/updater'

const Web3ProviderNetwork = createWeb3ReactRoot(NETWORK_CONTEXT_NAME)

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider, 'any')
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <ApplicationStateUpdater />
          <MulticallStateUpdater />
          <BrowserRouter>
            <MultiChainLinksUpdater />
            <Web3ReactManager>
              <App />
            </Web3ReactManager>
          </BrowserRouter>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)
