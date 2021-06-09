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

export function App() {
  const darkMode = useIsDarkMode()
  const theme = getTheme(darkMode)

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Header />
        <Flex alignItems="center" flexDirection="column" pt="94px" height="100%">
          <Flex flexDirection="column" height="100%" width={['100%', '80%', '60%', '60%', '40%']}>
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
          <Box width={['100%', '80%', '70%', '50%', '30%']}>
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
