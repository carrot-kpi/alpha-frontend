import { getTheme } from '../../theme'
import { useIsDarkMode } from '../../state/user/hooks'
import { Footer } from '../../components/footer'
import { Header } from '../../components/header'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { Home } from '../home'
import { Campaign } from '../campaign'
import { Flex, Box } from 'rebass'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '../../theme'
import { SkeletonTheme } from 'react-loading-skeleton'
import { useEffect } from 'react'
import { useLocation } from 'react-use'
import { TransactionsStateUpdater } from '../../state/transactions/updater'

export function App() {
  const darkMode = useIsDarkMode()
  const theme = getTheme(darkMode)
  const location = useLocation()

  // resets scroll on body after every change of route
  useEffect(() => {
    document.getElementsByTagName('body')[0].scrollTo(0, 0)
  }, [location])

  return (
    <>
      <ThemeProvider theme={theme}>
        <TransactionsStateUpdater />
        <GlobalStyle />
        <Header />
        <Flex alignItems="center" flexDirection="column" pt="94px" height="100%">
          <Flex flexDirection="column" flex="1" width={['100%', '80%', '60%', '60%', '40%']}>
            <Box flexGrow={1}>
              <SkeletonTheme color={theme.skeletonColor} highlightColor={theme.skeletonHighlightColor}>
                <Switch>
                  <Route strict exact path="/" component={Home} />
                  <Route strict exact path="/campaigns/:kpiId" component={Campaign} />
                  <Redirect to="/" />
                </Switch>
              </SkeletonTheme>
            </Box>
          </Flex>
          <Box width={['100%', '80%', '60%', '60%', '40%']}>
            <Footer />
          </Box>
        </Flex>
      </ThemeProvider>
      <ToastContainer
        className="custom-toast-root"
        toastClassName="custom-toast-container"
        bodyClassName="custom-toast-body"
        position="top-right"
        closeButton={false}
        transition={Slide}
      />
    </>
  )
}
