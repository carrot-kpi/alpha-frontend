import { darken } from 'polished'
import { Card as RebassCard } from 'rebass'
import styled from 'styled-components'

export const Card = styled(RebassCard)<{
  clickable?: boolean
  backgroundColor?: string
  onClick?: () => void
  disabled?: boolean
}>`
  border: solid 1px ${(props) => props.theme.divider};
  padding: 20px;
  border-radius: 16px;
  background-color: ${(props) => props.backgroundColor || props.theme.background};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : props.clickable ? 'pointer' : 'auto')};
  transition: background-color 0.2s ease;
  :hover {
    background-color: ${(props) =>
      props.clickable && !props.disabled
        ? darken(0.05, props.backgroundColor || props.theme.background)
        : props.backgroundColor || props.theme.background};
  }
`
