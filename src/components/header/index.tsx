import { useWeb3React } from '@web3-react/core'
import { ReactElement, useCallback } from 'react'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { injected } from '../../connectors'
import { shortenAddress } from '../../utils'
import { ButtonMedium } from '../button'
import { SmoothScrollLink } from '../smooth-scroll-link'
import logo from '../../assets/logo.svg'

const FlexContainer = styled(Flex)`
  position: fixed;
  z-index: 4;
  background-color: ${(props) => props.theme.white};
  border-bottom: solid 1px ${(props) => props.theme.divider};
`

const Spacer = styled.img`
  height: 74px;
`

const Logo = styled.img`
  height: 36px;
`

const Divider = styled.div`
  width: 1px;
  height: 36px;
  background-color: ${(props) => props.theme.divider};
`

const HeaderItem = styled(Box)`
  font-size: 18px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0em;
`

export const Header = (): ReactElement => {
  const { activate, account } = useWeb3React()

  const handleClick = useCallback(() => {
    activate(injected)
  }, [activate])

  return (
    <>
      <FlexContainer width="100%" height="80px" justifyContent="center" alignItems="center" px="24px">
        <Flex width={['100%', '80%', '60%']} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Box mr="36px">
              <Logo src={logo} alt="logo" />
            </Box>
            <Box mr="36px">
              <Divider />
            </Box>
            <HeaderItem mr="36px">
              <SmoothScrollLink smooth="easeInOutQuint" to="campaigns">
                Campaigns
              </SmoothScrollLink>
            </HeaderItem>
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
      <Spacer />
    </>
  )
}
