import { Card as RebassCard } from 'rebass'
import styled from 'styled-components'

export const Card = styled(RebassCard)`
  background-color: ${(props) => props.theme.primary3};
  padding: 30px 24px;
  border-radius: 16px;
`
