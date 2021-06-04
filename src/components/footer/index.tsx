import { Flex, Box, Text } from 'rebass'
import { UndecoratedExternalLink } from '../undecorated-link'
import logo from '../../assets/logo.svg'
import styled from 'styled-components'

const Logo = styled.img`
  height: 20px;
`

export const Footer = () => {
  return (
    <Flex mb="50px" justifyContent="space-between">
      <Flex>
        <Box mr="40px">
          <Logo src={logo} alt="logo" />
        </Box>
        <Box mr="40px">
          <Text fontSize="17px">© {new Date().getFullYear()} DXdao</Text>
        </Box>
      </Flex>
      <Flex>
        <Box mr="40px">
          <UndecoratedExternalLink href="https://discord.com/invite/4QXEJQkvHH">
            <Text fontSize="17px">Discord</Text>
          </UndecoratedExternalLink>
        </Box>
        <Box mr="40px">
          <UndecoratedExternalLink href="https://daotalk.org/c/dx-dao/15">
            <Text fontSize="17px">Forum</Text>
          </UndecoratedExternalLink>
        </Box>
      </Flex>
    </Flex>
  )
}
