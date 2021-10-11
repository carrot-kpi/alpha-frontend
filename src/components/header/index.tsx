import { ReactElement, useCallback, useState } from 'react'
import { Box, Flex, Text } from 'rebass'
import styled, { useTheme } from 'styled-components'
import { Button } from '../button'
import logo from '../../assets/logo.svg'
import { UndecoratedInternalLink } from '../undecorated-link'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectionPopover } from '../wallet-connection-popover'
import { NetworkSwitcherPopover } from '../network-switcher-popover'
import { NETWORK_DETAIL } from '../../constants'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { ChevronDown, Moon, Sun } from 'react-feather'
import { IdentityBadge } from '../identity-badge'
import { WalletModal } from '../wallet-modal'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useIsDarkMode, useToggleDarkMode } from '../../state/user/hooks'

const FlexContainer = styled(Flex)`
  position: fixed;
  top: 0;
  z-index: 4;
  background-color: ${(props) => props.theme.background};
  box-shadow: 0px 12px 12px 0px ${(props) => props.theme.background};
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
`

const Logo = styled.img`
  height: 20px;
`

const NetworkIcon = styled.img`
  border-radius: 8px;
  height: 28px;
`

const WrongNetwork = styled.div`
  height: 28px;
  background-color: ${(props) => props.theme.negativeSurface};
  color: ${(props) => props.theme.negativeSurfaceContent};
  padding: 0 12px;
  border-radius: 14px;
  line-height: 24px;
  display: flex;
  align-items: center;
  font-size: 12px;
  text-transform: uppercase;
`

const StyledChevronDown = styled(ChevronDown)`
  height: 18px;
  color: ${(props) => props.theme.contentSecondary};
  padding-top: 8px;
`

const ClickableFlex = styled(Flex)`
  cursor: pointer;
`

export const Header = (): ReactElement => {
  const { chainId, account } = useActiveWeb3React()
  const { error } = useWeb3React()
  const theme = useTheme()
  const isMobile = useIsMobile()

  const [showWalletConnectionPopover, setShowWalletConnectionPopover] = useState(false)
  const [showNetworkSwitchPopover, setShowNetworkSwitchPopover] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)

  const darkMode = useIsDarkMode()
  const toggleDarkMode = useToggleDarkMode()

  const handleAccountClick = useCallback(() => {
    setWalletModalOpen(true)
  }, [])

  const handleWalletModalClose = useCallback(() => {
    setWalletModalOpen(false)
  }, [])

  const handleConnectWalletClick = useCallback(() => {
    setShowWalletConnectionPopover(true)
  }, [])

  const handleWalletConnectionPopoverHide = useCallback(() => {
    setShowWalletConnectionPopover(false)
  }, [])

  const handleSwitchNetworkClick = useCallback(() => {
    setShowNetworkSwitchPopover(true)
  }, [])

  const handleNetworkSwitchPopoverHide = useCallback(() => {
    setShowNetworkSwitchPopover(false)
  }, [])

  return (
    <>
      <WalletModal open={walletModalOpen} onDismiss={handleWalletModalClose} />
      <FlexContainer width="100%" height="70px" justifyContent="center" alignItems="center" px={['16px', '24px']}>
        <Flex width={['100%', '80%', '60%', '60%', '40%']} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Box>
              <UndecoratedInternalLink to="/">
                <Logo src={logo} alt="logo" />
              </UndecoratedInternalLink>
            </Box>
          </Flex>
          <Flex alignItems="center">
            <Box mr="20px">
              {error instanceof UnsupportedChainIdError ? (
                <WrongNetwork>Invalid network</WrongNetwork>
              ) : !!account ? (
                <IdentityBadge account={account} onClick={handleAccountClick} />
              ) : (
                <WalletConnectionPopover show={showWalletConnectionPopover} onHide={handleWalletConnectionPopoverHide}>
                  <Button primary onClick={handleConnectWalletClick}>
                    Connect wallet
                  </Button>
                </WalletConnectionPopover>
              )}
            </Box>
            <Box mr="12px">
              <NetworkSwitcherPopover show={showNetworkSwitchPopover} onHide={handleNetworkSwitchPopoverHide}>
                {chainId && NETWORK_DETAIL[chainId]?.icon ? (
                  isMobile ? (
                    <NetworkIcon src={NETWORK_DETAIL[chainId]?.icon} onClick={handleSwitchNetworkClick} />
                  ) : (
                    <ClickableFlex alignItems="center" onClick={handleSwitchNetworkClick}>
                      <Box mr="8px" display="flex" alignItems="center">
                        <NetworkIcon src={NETWORK_DETAIL[chainId]?.icon} />
                      </Box>
                      <Flex flexDirection="column" mr="4px">
                        <Text color={theme.contentSecondary} lineHeight="14px" fontSize="12px">
                          Network
                        </Text>
                        <Text lineHeight="16px">{NETWORK_DETAIL[chainId]?.chainName}</Text>
                      </Flex>
                      <Box>
                        <StyledChevronDown />
                      </Box>
                    </ClickableFlex>
                  )
                ) : (
                  <Button onClick={handleSwitchNetworkClick}>Switch network</Button>
                )}
              </NetworkSwitcherPopover>
            </Box>
            <Box display="flex" alignItems="center">
              {darkMode ? (
                <Sun size="20px" cursor="pointer" onClick={toggleDarkMode} />
              ) : (
                <Moon size="20px" cursor="pointer" onClick={toggleDarkMode} />
              )}
            </Box>
          </Flex>
        </Flex>
      </FlexContainer>
    </>
  )
}
