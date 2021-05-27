import { ReactElement, useMemo } from 'react'
import { ThemeProvider } from 'styled-components'
import Web3ReactManager from '../../components/web3-react-manager'
import { SkeletonTheme } from 'react-loading-skeleton'
import { getTheme, GlobalStyle } from '../../theme'
import { useIsDarkMode } from '../../state/user/hooks'
import { Header } from '../../components/header'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { ApolloProvider } from '@apollo/client'
import { subgraphClient } from '../../apollo/client'
import { Home } from '../home'

export function App(): ReactElement {
  const darkMode = useIsDarkMode()
  const theme = useMemo(() => getTheme(darkMode), [darkMode])

  return (
    <ApolloProvider client={subgraphClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <SkeletonTheme color={theme.white} highlightColor={theme.black}>
          <Web3ReactManager>
            <ToastContainer
              className="custom-toast-root"
              toastClassName="custom-toast-container"
              bodyClassName="custom-toast-body"
              position="top-right"
              closeButton={false}
              transition={Slide}
            />
            <Header />
            <Switch>
              <Route strict exact path="/" component={Home} />
              <Redirect to="/" />
            </Switch>
          </Web3ReactManager>
        </SkeletonTheme>
      </ThemeProvider>
    </ApolloProvider>
  )
}
