import { useWeb3React } from '@web3-react/core'
import { ReactElement, useCallback } from 'react'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { injected } from '../../connectors'
import { shortenAddress } from '../../utils'
import { ButtonMedium } from '../button'
import logo from '../../assets/logo.svg'
import { UndecoratedInternalLink } from '../undecorated-link'

const FlexContainer = styled(Flex)`
  position: fixed;
  z-index: 4;
  background-color: ${(props) => props.theme.white};
  border-bottom: solid 1px ${(props) => props.theme.divider};
`

const Logo = styled.img`
  height: 30px;
`

export const Header = (): ReactElement => {
  const { activate, account } = useWeb3React()

  const handleClick = useCallback(() => {
    activate(injected)
  }, [activate])

  return (
    <>
      <FlexContainer width="100%" height="70px" justifyContent="center" alignItems="center" px="24px">
        <Flex width={['100%', '80%', '60%', '60%', '40%']} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Box>
              <UndecoratedInternalLink to="/">
                <Logo src={logo} alt="logo" />
              </UndecoratedInternalLink>
            </Box>
          </Flex>
          <Box>
            {!!account ? (
              /* Make this a secondary button */
              <ButtonMedium>{shortenAddress(account)}</ButtonMedium>
            ) : (
              <ButtonMedium onClick={handleClick}>Connect wallet</ButtonMedium>
            )}
          </Box>
        </Flex>
      </FlexContainer>
    </>
  )
}
