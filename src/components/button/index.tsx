import { darken } from 'polished'
import styled from 'styled-components'
import { Box, Button as RebassButton, ButtonProps as RebassButtonProps, Flex } from 'rebass'
import { ReactNode } from 'react'

interface ButtonProps {
  medium?: boolean
  small?: boolean
  mini?: boolean

  primary?: boolean
  positive?: boolean
  negative?: boolean
  disabled?: boolean

  children?: ReactNode
}

const Root = styled(RebassButton)<ButtonProps & RebassButtonProps>`
  height: ${(props) => {
    if (props.small) return '32px'
    if (props.mini) return '25px'
    return '40px'
  }};
  line-height: 24px !important;
  text-decoration: none;
  font-size: 16px !important;
  padding: 0 ${(props) => (props.small ? '16px' : props.mini ? '12px' : '24px')};
  cursor: pointer;
  background-color: ${(props) => {
    if (props.primary) return props.theme.accent
    else if (props.positive) return props.theme.positiveSurface
    else if (props.negative) return props.theme.negativeSurface
    else if (props.disabled) return props.theme.disabled
    else return props.theme.surfaceInteractive
  }} !important;
  color: ${(props) => {
    if (props.primary) return props.theme.accentContent
    else if (props.positive) return props.theme.positiveSurfaceContent
    else if (props.negative) return props.theme.negativeSurfaceContent
    else if (props.disabled) return props.theme.disabledContent
    else return props.theme.surfaceContent
  }} !important;
  border: ${(props) =>
    props.primary || props.positive || props.negative || props.disabled
      ? 'none'
      : `solid 1px ${props.theme.border}`} !important;
  border-radius: 8px !important;
  box-shadow: ${(props) =>
    props.primary || props.positive || props.negative || props.disabled ? 'none' : `rgba(0, 0, 0, 0.1) 0px 1px 3px`};
  outline: none;
  transition: background-color 0.2s ease, transform 0.2s ease, border 0.2s ease;
  :hover:not(:disabled) {
    background-color: ${(props) => {
      let color = props.theme.surfaceInteractive
      if (props.primary) color = props.theme.accent
      else if (props.positive) color = props.theme.positiveSurface
      else if (props.negative) color = props.theme.negativeSurface
      else if (props.disabled) color = props.theme.disabled
      return darken(0.06, color)
    }};
    transform: scale(1.02);
  }
  :active:not(:disabled),
  :focus:not(:disabled) {
    transform: scale(0.98);
  }
`

export const Button = ({ children, ...rest }: ButtonProps & RebassButtonProps) => {
  return (
    <Root {...rest}>
      <Flex height="100%" alignItems="center">
        <Box>{children}</Box>
      </Flex>
    </Root>
  )
}
