import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ExternalLink as ExternalLinkIcon } from 'react-feather'
import { ReactNode } from 'react'

export const UndecoratedInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
`

export const UndecoratedExternalLink = styled.a.attrs(() => ({ target: '_blank', rel: 'noopener noreferrer' }))`
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  color: ${(props) => props.theme.surfaceContent};
`

const DecoratedExternalLink = styled.a.attrs(() => ({ target: '_blank', rel: 'noopener noreferrer' }))`
  width: fit-content;
  cursor: pointer;
  color: ${(props) => props.theme.accent};
  :visited {
    color: ${(props) => props.theme.accent};
  }
`

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
  color: ${(props) => props.theme.accent};
  width: 12px;
  height: 12px;
`

interface ExternalLinkProps {
  children: ReactNode
  href: string
}

export const ExternalLink = ({ children, href }: ExternalLinkProps) => (
  <DecoratedExternalLink href={href}>
    {children} <StyledExternalLinkIcon />
  </DecoratedExternalLink>
)
