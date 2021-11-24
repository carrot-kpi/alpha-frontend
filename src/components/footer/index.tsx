import { Flex, Box, Text } from 'rebass'
import { ExternalLink } from '../undecorated-link'
import { useIsDarkMode } from '../../state/user/hooks'
import { Logo } from '../logo'

export const Footer = () => {
  const darkMode = useIsDarkMode()

  return (
    <Flex mb="40px" px={['16px']} alignItems="center" justifyContent="space-between">
      <Box mr="16px">
        <Logo darkMode={darkMode} />
      </Box>
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
