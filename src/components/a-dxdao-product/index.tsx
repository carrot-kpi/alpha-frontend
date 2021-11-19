import { Text } from 'rebass'
import styled, { useTheme } from 'styled-components'
import { UndecoratedExternalLink } from '../undecorated-link'

const AccentedUndecoratedExternalLink = styled(UndecoratedExternalLink)`
  color: ${(props) => props.theme.accent};
`

export const ADXdaoProduct = () => {
  const theme = useTheme()
  return (
    <Text color={theme.accent} fontSize="10px" fontWeight="800" textAlign="center" letterSpacing="2px">
      A <AccentedUndecoratedExternalLink href="https://dxdao.eth.link">DXDAO</AccentedUndecoratedExternalLink> PRODUCT
    </Text>
  )
}
