import { Card as RebassCard } from 'rebass'
import styled from 'styled-components'

export const Card = styled(RebassCard)`
  border: solid 1px ${(props) => props.theme.divider};
  padding: 30px 24px;
  border-radius: 16px;
`
