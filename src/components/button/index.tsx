import { darken, lighten } from 'polished'
import styled from 'styled-components'
import { Button as RebassButton } from 'rebass'

const Base = styled(RebassButton)`
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  padding: 0 20px;
  cursor: pointer;
  background-color: ${(props) => props.theme.primary1};
  border: none;
  outline: none;
  color: ${(props) => props.theme.white};
  transition: background-color 0.3s ease, transform 0.3s ease;
  :hover:not(:disabled) {
    background-color: ${(props) => darken(0.06, props.theme.primary1)};
    transform: scale(1.02);
  }
  :active:not(:disabled) {
    transform: scale(0.98);
  }
  :disabled {
    background-color: ${(props) => lighten(0.7, props.theme.black)};
    cursor: not-allowed;
  }
`

export const ButtonSmall = styled(Base)`
  height: 36px;
  border-radius: 22px;
`

export const ButtonMedium = styled(Base)`
  height: 40px;
  border-radius: 24px;
`

export const ButtonLarge = styled(Base)`
  height: 44px;
  border-radius: 28px;
`
