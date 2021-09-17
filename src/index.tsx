import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { App } from './pages/app'
import { store } from './state'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { NETWORK_CONTEXT_NAME } from './constants'
import { Web3Provider } from '@ethersproject/providers'
import Web3ReactManager from './components/web3-manager'
import { ApplicationStateUpdater } from './state/application/updater'
import { TransactionsStateUpdater } from './state/transactions/updater'
import { MulticallStateUpdater } from './state/multicall/updater'

const Web3ProviderNetwork = createWeb3ReactRoot(NETWORK_CONTEXT_NAME)

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider, 'any')
}

function Updaters() {
  return (
    <>
      <ApplicationStateUpdater />
      <TransactionsStateUpdater />
      <MulticallStateUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <Updaters />
          <HashRouter>
            <Web3ReactManager>
              <App />
            </Web3ReactManager>
          </HashRouter>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)
