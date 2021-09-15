import { ReactElement, useCallback, useState } from 'react'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { shortenAddress } from '../../utils'
import { ButtonSmall } from '../button'
import logo from '../../assets/logo.svg'
import { UndecoratedInternalLink } from '../undecorated-link'
import { useEthers } from '@usedapp/core'
import { UnsupportedChainIdError } from '@web3-react/core'
import { WalletConnectionPopover } from '../wallet-connection-popover'
import { NetworkSwitcherPopover } from '../network-switcher-popover'
import { WalletModal } from '../wallet-modal'
import { NETWORK_DETAIL } from '../../constants'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const FlexContainer = styled(Flex)`
  position: fixed;
  z-index: 4;
  background-color: ${(props) => props.theme.background};
  border-bottom: solid 1px ${(props) => props.theme.divider};
`

const Logo = styled.img`
  height: 20px;
`

const AddressContainer = styled.div`
  height: 28px;
  color: ${(props) => props.theme.primary};
  border: solid 1.5px ${(props) => props.theme.primary};
  border-radius: 28px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
`

const NetworkIcon = styled.img`
  border-radius: 50%;
  height: 28px;
  cursor: pointer;
`

const WrongNetwork = styled.div`
  height: 28px;
  background-color: ${(props) => props.theme.error};
  color: ${(props) => props.theme.white};
  padding: 0 12px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  font-size: 12px;
  text-transform: uppercase;
`

export const Header = (): ReactElement => {
  const { account, error } = useEthers()
  const { chainId } = useActiveWeb3React()
  const [showWalletConnectionPopover, setShowWalletConnectionPopover] = useState(false)
  const [showNetworkSwitchPopover, setShowNetworkSwitchPopover] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  /* const darkMode = useIsDarkMode()
  const toggleDarkMode = useToggleDarkMode() */

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

  const handleAccountClick = useCallback(() => {
    setWalletModalOpen(true)
  }, [])

  const handleWalletModalClose = useCallback(() => {
    setWalletModalOpen(false)
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
            <Box mr="12px">
              {error instanceof UnsupportedChainIdError ? (
                <WrongNetwork>Invalid network</WrongNetwork>
              ) : !!account ? (
                <AddressContainer onClick={handleAccountClick}>{shortenAddress(account)}</AddressContainer>
              ) : (
                <WalletConnectionPopover show={showWalletConnectionPopover} onHide={handleWalletConnectionPopoverHide}>
                  <ButtonSmall onClick={handleConnectWalletClick}>Connect wallet</ButtonSmall>
                </WalletConnectionPopover>
              )}
            </Box>
            <Box>
              <NetworkSwitcherPopover show={showNetworkSwitchPopover} onHide={handleNetworkSwitchPopoverHide}>
                {chainId && NETWORK_DETAIL[chainId]?.icon ? (
                  <NetworkIcon src={NETWORK_DETAIL[chainId]?.icon} onClick={handleSwitchNetworkClick} />
                ) : (
                  <ButtonSmall onClick={handleSwitchNetworkClick}>Switch network</ButtonSmall>
                )}
              </NetworkSwitcherPopover>
            </Box>
            {/* <Box ml="20px">
              {darkMode ? (
                <Sun size="20px" cursor="pointer" onClick={toggleDarkMode} />
              ) : (
                <Moon size="20px" cursor="pointer" onClick={toggleDarkMode} />
              )}
            </Box> */}
          </Flex>
        </Flex>
      </FlexContainer>
    </>
  )
}
