import { Box, Flex, Image, Text } from 'rebass'
import logoLight from '../../assets/logo-light.png'
import logoDark from '../../assets/logo-dark.png'
import { version } from '../../../package.json'
import { useTheme } from 'styled-components'

interface LogoProps {
  darkMode: boolean
}

export const Logo = ({ darkMode }: LogoProps) => {
  const theme = useTheme()
  return (
    <Flex alignItems="center">
      <Box mr="4px">
        <Image display="flex" src={darkMode ? logoLight : logoDark} height="28px" alt="logo" />
      </Box>
      <Text fontSize="12px" fontWeight="700" color={theme.content}>
        v{version}
      </Text>
    </Flex>
  )
}
