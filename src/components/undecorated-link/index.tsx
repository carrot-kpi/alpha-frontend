import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const UndecoratedInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
`

export const UndecoratedExternalLink = styled.a.attrs((props) => ({ target: '_blank', rel: 'noopener noreferrer' }))`
  text-decoration: none;
  cursor: pointer;
`
