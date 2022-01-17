import { getTheme } from '../../theme'
import { useIsDarkMode } from '../../state/user/hooks'
import { Footer } from '../../components/footer'
import { Header } from '../../components/header'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { Home } from '../home'
import { Campaign } from '../campaign'
import { Flex, Box } from 'rebass'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '../../theme'
import { SkeletonTheme } from 'react-loading-skeleton'
import { useEffect } from 'react'
import useLocation from 'react-use/lib/useLocation'
import { TransactionsStateUpdater } from '../../state/transactions/updater'
import { NetworkWarningModal } from '../../components/network-warning-modal'

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
        <SkeletonTheme baseColor={theme.border} highlightColor={theme.surfaceInteractive}>
          <Header />
          <Flex alignItems="center" flexDirection="column" pt="94px" height="100%">
            <Flex flexDirection="column" flex="1" width="100%">
              <Box flexGrow={1}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/campaigns/:kpiId" element={<Campaign />} />
                </Routes>
              </Box>
            </Flex>
            <Box width={['100%', '80%', '70%', '55%']}>
              <Footer />
            </Box>
          </Flex>
        </SkeletonTheme>
        <NetworkWarningModal />
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
