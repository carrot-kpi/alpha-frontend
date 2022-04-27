import { ReactElement, useCallback, useState } from 'react'
import { Box, Flex, Text } from 'rebass'
import styled, { useTheme } from 'styled-components'
import { Button } from '../button'
import { UndecoratedInternalLink } from '../undecorated-link'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectionPopover } from '../wallet-connection-popover'
import { NetworkSwitcherPopover } from '../network-switcher-popover'
import { NETWORK_DETAIL } from '../../constants'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { ChevronDown, Menu, Moon, Sun } from 'react-feather'
import { IdentityBadge } from '../identity-badge'
import { WalletPopover } from '../wallet-popover'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useIsDarkMode, useToggleDarkMode } from '../../state/user/hooks'
import { Logo } from '../logo'
import { useLocation } from 'react-router-dom'

const FlexContainer = styled(Flex)`
  position: fixed;
  top: 0;
  z-index: 4;
  background-color: ${(props) => props.theme.background};
  box-shadow: 0px 12px 12px 0px ${(props) => props.theme.background};
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
`

const NetworkIcon = styled.img`
  border-radius: 8px;
  height: 32px;
  max-height: 32px;
  cursor: pointer;
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

const MenuItem = styled(Text)<{ active?: boolean }>`
  color: ${(props) => (props.active ? props.theme.accent : 'initial')};
  font-weight: 600;
  transition: font-weight 0.3s ease;
`

const VerticalDivider = styled(Box)`
  height: 28px;
  width: 1px;
  background-color: ${(props) => props.theme.border};
`

const ClickableFlex = styled(Flex)`
  cursor: pointer;
`

const MobileMenu = styled(Flex)<{ show: boolean }>`
  position: fixed;
  z-index: 10;
  width: 100%;
  bottom: ${(props) => (props.show ? 0 : '-100%')};
  transition: bottom 0.3s ease;
  background-color: ${(props) => props.theme.surface};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0px 5px 20px 4px rgba(0, 0, 0, 0.44);
`

const MobileMenuOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  z-index: 8;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: ${(props) => (props.show ? 1 : 0)};
  pointer-events: ${(props) => (props.show ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
  background-color: rgba(0, 0, 0, 0.4);
`

export const Header = (): ReactElement => {
  const { chainId, account } = useActiveWeb3React()
  const { error } = useWeb3React()
  const theme = useTheme()
  const isMobile = useIsMobile()
  const { pathname } = useLocation()

  const [showWalletConnectionPopover, setShowWalletConnectionPopover] = useState(false)
  const [showNetworkSwitchPopover, setShowNetworkSwitchPopover] = useState(false)
  const [walletPopoverOpen, setWalletPopoverOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const darkMode = useIsDarkMode()
  const toggleDarkMode = useToggleDarkMode()

  const handleAccountClick = useCallback(() => {
    setWalletPopoverOpen(true)
  }, [])

  const handleWalletModalClose = useCallback(() => {
    setWalletPopoverOpen(false)
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

  const handleShowMobileMenu = useCallback(() => {
    setMobileMenuOpen(true)
  }, [])

  const handleHideMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <MobileMenuOverlay show={mobileMenuOpen} onClick={handleHideMobileMenu} />
      <MobileMenu show={mobileMenuOpen} flexDirection="column">
        <Box>
          <UndecoratedInternalLink to="/campaigns" onClick={handleHideMobileMenu}>
            <MenuItem active={pathname.includes('campaigns')}>Campaigns</MenuItem>
          </UndecoratedInternalLink>
        </Box>
      </MobileMenu>
      <FlexContainer width="100%" height="70px" justifyContent="center" alignItems="center" px={['16px', '24px']}>
        <Flex width={['100%', '85%', '75%', '60%']} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Box>
              <UndecoratedInternalLink to="/">
                <Logo darkMode={darkMode} />
              </UndecoratedInternalLink>
            </Box>
            <VerticalDivider ml="32px" display={['none', 'none', 'block']} />
            <Box display={['none', 'block']} ml="28px">
              <UndecoratedInternalLink to="/campaigns">
                <MenuItem active={pathname.includes('campaigns')}>Campaigns</MenuItem>
              </UndecoratedInternalLink>
            </Box>
          </Flex>
          <Flex alignItems="center">
            <Box mr={['12px', '16px']} height="32px">
              {error instanceof UnsupportedChainIdError ? (
                <WrongNetwork>Invalid network</WrongNetwork>
              ) : !!account ? (
                <WalletPopover show={walletPopoverOpen} onHide={handleWalletModalClose}>
                  <IdentityBadge account={account} onClick={handleAccountClick} />
                </WalletPopover>
              ) : (
                <WalletConnectionPopover show={showWalletConnectionPopover} onHide={handleWalletConnectionPopoverHide}>
                  <Button primary small onClick={handleConnectWalletClick}>
                    Connect wallet
                  </Button>
                </WalletConnectionPopover>
              )}
            </Box>
            <Box mr="12px" height="32px">
              <NetworkSwitcherPopover show={showNetworkSwitchPopover} onHide={handleNetworkSwitchPopoverHide}>
                {chainId && NETWORK_DETAIL[chainId]?.icon ? (
                  isMobile ? (
                    <NetworkIcon src={NETWORK_DETAIL[chainId]?.icon} onClick={handleSwitchNetworkClick} />
                  ) : (
                    <ClickableFlex alignItems="center" onClick={handleSwitchNetworkClick}>
                      <Box mr="8px" display="flex" alignItems="center">
                        <NetworkIcon src={NETWORK_DETAIL[chainId]?.icon} />
                      </Box>
                      <Flex width="60px" flexDirection="column">
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
                  <Button mini onClick={handleSwitchNetworkClick}>
                    Switch network
                  </Button>
                )}
              </NetworkSwitcherPopover>
            </Box>
            <Box mr="12px" display="flex" alignItems="center" height="28px">
              {darkMode ? (
                <Sun size="20px" cursor="pointer" onClick={toggleDarkMode} />
              ) : (
                <Moon size="20px" cursor="pointer" onClick={toggleDarkMode} />
              )}
            </Box>
            <Box display={['flex', 'flex', 'none']} alignItems="center" height="28px">
              <Menu size="20px" cursor="pointer" onClick={handleShowMobileMenu} />
            </Box>
          </Flex>
        </Flex>
      </FlexContainer>
    </>
  )
}
