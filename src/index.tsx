import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { App } from './pages/app'
import { store } from './state'
import { Config, ChainId, DAppProvider } from '@usedapp/core'
import { RPC_URL, SUPPORTED_CHAINS } from './connectors'

const config: Config = {
  readOnlyChainId: ChainId.Rinkeby,
  supportedChains: SUPPORTED_CHAINS,
  readOnlyUrls: RPC_URL,
}

ReactDOM.render(
  <StrictMode>
    <DAppProvider config={config}>
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    </DAppProvider>
  </StrictMode>,
  document.getElementById('root')
)
