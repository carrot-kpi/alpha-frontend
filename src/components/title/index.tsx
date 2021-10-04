import { Text } from 'rebass'
import styled from 'styled-components'

export const Title = styled(Text)`
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.contentSecondary};
`
