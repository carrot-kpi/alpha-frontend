import { ReactElement, useCallback, useState } from 'react'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { shortenAddress } from '../../utils'
import { ButtonSmall } from '../button'
import logo from '../../assets/logo.svg'
import { UndecoratedInternalLink } from '../undecorated-link'
import { useEthers } from '@usedapp/core'
import { WalletConnectionModal } from '../wallet-connection-modal'

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
  height: 36px;
  color: ${(props) => props.theme.primary};
  border: solid 1px ${(props) => props.theme.primary};
  border-radius: 20px;
  padding: 0 16px;
  display: flex;
  align-items: center;
`

export const Header = (): ReactElement => {
  const { account } = useEthers()
  const [walletConnectionModalOpen, setWalletConnectionModalOpen] = useState(false)
  /* const darkMode = useIsDarkMode()
  const toggleDarkMode = useToggleDarkMode() */

  const handleClick = useCallback(() => {
    setWalletConnectionModalOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setWalletConnectionModalOpen(false)
  }, [])

  return (
    <>
      <WalletConnectionModal open={walletConnectionModalOpen} onDismiss={handleClose} />
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
            <Box>
              {!!account ? (
                <AddressContainer>{shortenAddress(account)}</AddressContainer>
              ) : (
                <ButtonSmall onClick={handleClick}>Connect wallet</ButtonSmall>
              )}
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
