import { darken } from 'polished'
import { Card as RebassCard } from 'rebass'
import styled, { css } from 'styled-components'

export const Card = styled(RebassCard)<{
  clickable?: boolean
  backgroundColor?: string
  onClick?: () => void
  disabled?: boolean
}>`
  padding: 20px;
  border: ${(props) => `solid 1px ${props.theme.border}`};
  border-radius: 8px !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px;
  background-color: ${(props) => props.backgroundColor || props.theme.surface};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : props.clickable ? 'pointer' : 'auto')};
  transition: background-color 0.2s ease, border 0.2s ease;
  ${(props) =>
    props.clickable &&
    !props.disabled &&
    css`
      :hover {
        background-color: ${darken(0.05, props.backgroundColor || props.theme.surface)};
      }
    `}
`
