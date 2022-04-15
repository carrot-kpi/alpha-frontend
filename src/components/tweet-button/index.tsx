import { Button } from '../button'
import styled from 'styled-components'

export const TweetButton = styled(Button)`
  background-color: ${(props) => props.theme.twitter} !important;
  color: ${(props) => props.theme.accentContent} !important;
`
