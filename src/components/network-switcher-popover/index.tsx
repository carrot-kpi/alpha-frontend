import { ReactNode, useCallback } from 'react'
import { NETWORK_CONTEXT_NAME, NETWORK_DETAIL } from '../../constants'
import { Popover } from '../popover'
import { ChainId } from '@carrot-kpi/sdk'
import { Flex, Text } from 'rebass'
import { Card } from '../card'
import { NetworkConnector } from '@web3-react/network-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { switchOrAddNetwork } from '../../utils'
import styled from 'styled-components'

interface NetworkSwitcherPopoverProps {
  children: ReactNode
  show: boolean
  onHide: () => void
}

const BackgroundImageCard = styled(Card)<{ backgroundImage: string }>`
  background-image: url(${(props) => props.backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
`

const NetworkText = styled(Text)`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 8px;
`

export const NetworkSwitcherPopover = ({ children, show, onHide }: NetworkSwitcherPopoverProps) => {
  const { connector, chainId: networkConnectorChainId } = useWeb3React(NETWORK_CONTEXT_NAME)
  const {
    error: walletConnectionError,
    connector: walletConnectionConnector,
    account,
    chainId: walletConnectorChainId,
  } = useWeb3React()

  const handleNetworkChange = useCallback(
    (optionChainId: ChainId) => {
      if (
        !!!account &&
        connector instanceof NetworkConnector &&
        !(walletConnectionError instanceof UnsupportedChainIdError)
      )
        connector.changeChainId(optionChainId)
      // handle network connector switcher in header too
      else if (walletConnectionConnector instanceof InjectedConnector)
        switchOrAddNetwork(NETWORK_DETAIL[optionChainId], account || undefined)
      onHide()
    },
    [account, connector, onHide, walletConnectionConnector, walletConnectionError]
  )

  const isOptionDisabled = useCallback(
    (networkId: ChainId) => {
      if (walletConnectionError instanceof UnsupportedChainIdError) return false
      return !!(
        connector?.supportedChainIds?.indexOf(networkId) === -1 ||
        (walletConnectorChainId || networkConnectorChainId) === networkId
      )
    },
    [connector?.supportedChainIds, networkConnectorChainId, walletConnectionError, walletConnectorChainId]
  )

  return (
    <Popover
      content={
        <Flex flexWrap="nowrap" alignItems="center">
          {Object.entries(NETWORK_DETAIL).map(([chainId, networkDetail], index) => {
            return (
              <BackgroundImageCard
                width="140px"
                height="100px"
                p="12px"
                clickable
                ml={index !== 0 ? '8px' : '0'}
                key={chainId}
                disabled={isOptionDisabled(Number(chainId))}
                onClick={() => {
                  handleNetworkChange(Number(chainId))
                }}
                backgroundImage={networkDetail.icon}
                opacity={isOptionDisabled(Number(chainId)) ? '0.2' : '1'}
              >
                <Flex height="100%" alignItems="flex-end">
                  <NetworkText fontSize="18px" color="#fff">
                    {networkDetail.chainName}
                  </NetworkText>
                </Flex>
              </BackgroundImageCard>
            )
          })}
        </Flex>
      }
      show={show}
      onHide={onHide}
    >
      {children}
    </Popover>
  )
}
