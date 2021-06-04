import { ReactElement, useMemo } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Web3ReactManager from '../../components/web3-react-manager'
import { SkeletonTheme } from 'react-loading-skeleton'
import { getTheme, GlobalStyle } from '../../theme'
import { useIsDarkMode } from '../../state/user/hooks'
import { Header } from '../../components/header'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { Home } from '../home'
import { Campaign } from '../campaign'

const Content = styled.div`
  padding-top: 24px;
`

export function App(): ReactElement {
  const darkMode = useIsDarkMode()
  const theme = useMemo(() => getTheme(darkMode), [darkMode])

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SkeletonTheme color={theme.grey1} highlightColor={theme.grey2}>
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
          <Content>
            <Switch>
              <Route strict exact path="/" component={Home} />
              <Route strict exact path="/campaigns/:kpiId" component={Campaign} />
              <Redirect to="/" />
            </Switch>
          </Content>
        </Web3ReactManager>
      </SkeletonTheme>
    </ThemeProvider>
  )
}
