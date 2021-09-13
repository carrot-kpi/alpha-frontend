import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { App } from './pages/app'
import { store } from './state'
import { Config, ChainId, DAppProvider } from '@usedapp/core'

const config: Config = {
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Mainnet]: 'https://mainnet.infura.io/v3/c3838db5bd7548059b34406877c476c2',
    [ChainId.Rinkeby]: 'https://rinkeby.infura.io/v3/c3838db5bd7548059b34406877c476c2',
  },
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
