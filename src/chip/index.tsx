import { transparentize } from 'polished'
import styled from 'styled-components'

export const Chip = styled.div`
  padding: 0 12px;
  font-size: 16px;
  height: 24px;
  background-color: ${(props) => transparentize(0.85, props.theme.surfaceContentSecondary)};
  color: ${(props) => props.theme.contentSecondary};
  border: solid 1px ${(props) => props.theme.contentSecondary};
  border-radius: 12px;
  line-height: 22px;
`
