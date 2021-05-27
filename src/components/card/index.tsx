import styled from 'styled-components'
import { Card as RebassCard } from 'rebass'

export const Card = styled(RebassCard)`
  border-radius: 12px;
  border: solid 1px ${(props) => props.theme.divider};
  padding: 16px;
`
