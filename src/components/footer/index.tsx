import { Flex, Box, Text } from 'rebass'
import { ExternalLink } from '../undecorated-link'
import logo from '../../assets/logo.svg'
import styled from 'styled-components'

const Logo = styled.img`
  height: 20px;
`

export const Footer = () => {
  return (
    <Flex mb="40px" px={['16px']} alignItems="center" justifyContent="space-between">
      <Flex flexDirection={['column', 'row']} justifyContent={['center']} alignItems={['flex-start', 'center']}>
        <Box mr="16px">
          <Logo src={logo} alt="logo" />
        </Box>
        <Box>
          <Text fontSize="12px">© {new Date().getFullYear()} DXdao</Text>
        </Box>
      </Flex>
      <Flex>
        <Box mr="16px">
          <ExternalLink href="https://discord.com/invite/4QXEJQkvHH">
            <Text fontSize="17px">Discord</Text>
          </ExternalLink>
        </Box>
        <Box>
          <ExternalLink href="https://daotalk.org/c/dx-dao/15">
            <Text fontSize="17px">Forum</Text>
          </ExternalLink>
        </Box>
      </Flex>
    </Flex>
  )
}
