import { Flex, Box, Text } from 'rebass'
import { ExternalLink } from '../undecorated-link'
import { useIsDarkMode } from '../../state/user/hooks'
import { Logo } from '../logo'

export const Footer = () => {
  const darkMode = useIsDarkMode()

  return (
    <Flex mb="40px" px={['16px', '0px']} alignItems="center" justifyContent="center">
      <Flex mr="12px" alignItems="center">
        <Box mr="6px">
          <Logo darkMode={darkMode} />
        </Box>
        <Text mr="6px" fontSize="12px">
          by
        </Text>
        <ExternalLink href="https://dxdao.eth.limo">DXdao</ExternalLink>
      </Flex>
      <Text mr="12px">&middot;</Text>
      <Box mr="12px">
        <ExternalLink href="https://discord.com/invite/4QXEJQkvHH">Discord</ExternalLink>
      </Box>
      <Text mr="12px">&middot;</Text>
      <Box>
        <ExternalLink href="https://twitter.com/CarrotEth">Twitter</ExternalLink>
      </Box>
    </Flex>
  )
}
