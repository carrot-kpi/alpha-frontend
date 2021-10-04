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
  padding: ${(props) => (props.mobile ? '0px' : '0px 12px 0px 0px')};
  border-radius: 8px;
  background-color: ${(props) => props.theme.infoSurface};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'auto')};
`

const Blockie = styled(Blockies)<{ mobile: boolean }>`
  border-radius: 8px;
  height: 28px !important;
  width: 28px !important;
  margin-right: ${(props) => (props.mobile ? 0 : '8px')};
`

const ConnectedDot = styled.div`
  border-radius: 50%;
  border: solid 3px ${(props) => props.theme.background};
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
