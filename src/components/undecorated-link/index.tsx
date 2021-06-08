import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const UndecoratedInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
`

export const UndecoratedExternalLink = styled.a.attrs((props) => ({ target: '_blank', rel: 'noopener noreferrer' }))`
  width: fit-content;
  cursor: pointer;
  color: ${(props) => props.theme.primary};
  :visited {
    color: ${(props) => props.theme.primary};
  }
`
