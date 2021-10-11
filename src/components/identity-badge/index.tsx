import { ReactElement } from 'react'
import styled from 'styled-components'
import { shortenAddress } from '../../utils'
import Blockies from 'react-blockies'
import { Text } from 'rebass'
import { useIsMobile } from '../../hooks/useIsMobile'

const FlexContainer = styled.div<{ onClick?: any; mobile: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  height: 28px;
  width: fit-content;
  border: ${(props) => `solid 1px ${props.theme.border}`};
  border-radius: 8px !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px;
  background-color: ${(props) => props.theme.surface};
  transition: background-color 0.2s ease, border 0.2s ease;
  padding: ${(props) => (props.mobile ? '0px' : '0px 12px 0px 0px')};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'auto')};
`

const Blockie = styled(Blockies)<{ mobile: boolean }>`
  border-radius: 8px;
  height: 24px !important;
  width: 24px !important;
  margin-right: ${(props) => (props.mobile ? 0 : '8px')};
  margin-left: 2px;
`

const ConnectedDot = styled.div`
  border-radius: 50%;
  border: solid 3px ${(props) => props.theme.background};
  transition: border 0.2s ease;
  width: 8px;
  height: 8px;
  background-color: ${(props) => props.theme.positive};
  position: absolute;
  bottom: -6px;
  left: -6px;
`

export const IdentityBadge = ({ account, onClick }: { account: string; onClick?: () => void }): ReactElement => {
  const isMobile = useIsMobile()

  return (
    <>
      <FlexContainer mobile={isMobile} onClick={onClick}>
        <Blockie mobile={isMobile} seed={account} />
        {!isMobile && <Text fontFamily="Overpass Mono">{shortenAddress(account)}</Text>}
        {isMobile && <ConnectedDot />}
      </FlexContainer>
    </>
  )
}
