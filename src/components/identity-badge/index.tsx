import { ReactElement } from 'react'
import styled from 'styled-components'
import { shortenAddress } from '../../utils'
import makeBlockie from 'ethereum-blockies-base64'
import { Flex, Text } from 'rebass'
import { useIsMobile } from '../../hooks/useIsMobile'
import { getAddress } from '@ethersproject/address'
import { useEnsName } from '../../hooks/useEnsName'
import Skeleton from 'react-loading-skeleton'

const FlexContainer = styled(Flex)<{ onClick?: any; mobile: boolean }>`
  position: relative;
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

const Blockie = styled.img<{ mobile: boolean }>`
  height: 26px;
  width: 28px;
  border-radius: ${(props) => (props.mobile ? 8 : 0)}px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-right: ${(props) => (props.mobile ? 0 : '8px')};
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
  const { loading: loadingEnsName, name: ensName } = useEnsName(account)

  return (
    <>
      <FlexContainer mobile={isMobile} onClick={onClick}>
        <Blockie mobile={isMobile} src={makeBlockie(getAddress(account))} />
        {!isMobile &&
          (loadingEnsName ? (
            <Skeleton width="140px" />
          ) : (
            <Text fontFamily="Overpass Mono">{ensName || shortenAddress(account)}</Text>
          ))}
        {isMobile && <ConnectedDot />}
      </FlexContainer>
    </>
  )
}
