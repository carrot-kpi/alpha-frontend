import { Web3ReactProvider } from '@web3-react/core'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { App } from './pages/app'
import { store } from './state'
import { ApplicationUpdater } from './state/application/updater'
import { TransactionsUpdater } from './state/transactions/updater'
import { UserUpdater } from './state/user/updater'
import { Web3Provider } from '@ethersproject/providers'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any) => new Web3Provider(provider)

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ApplicationUpdater />
        <TransactionsUpdater />
        <HashRouter>
          <UserUpdater />
          <App />
        </HashRouter>
      </Provider>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)
