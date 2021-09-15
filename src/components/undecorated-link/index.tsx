import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const UndecoratedInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
`

export const ExternalLink = styled.a.attrs(() => ({ target: '_blank', rel: 'noopener noreferrer' }))`
  width: fit-content;
  cursor: pointer;
  color: ${(props) => props.theme.primary};
  :visited {
    color: ${(props) => props.theme.primary};
  }
`

export const UndecoratedExternalLink = styled.a.attrs(() => ({ target: '_blank', rel: 'noopener noreferrer' }))`
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  color: ${(props) => props.theme.text};
`
