import { ReactNode, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { NETWORK_CONTEXT_NAME, NETWORK_DETAIL } from '../../constants'
import { Popover } from '../popover'
import { useClickAway } from 'react-use'
import { ChainId } from '@carrot-kpi/sdk'
import { Box, Flex, Text } from 'rebass'
import { Card } from '../card'
import { NetworkConnector } from '@web3-react/network-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { switchOrAddNetwork } from '../../utils'

const Wrapper = styled.div`
  width: 100%;
`

const StyledPopover = styled(Popover)`
  max-width: 290px;
  padding: 22px;
  border-style: solid;
  border-width: 1.2px;
  border-radius: 12px;
  border-image: none;
`

interface NetworkSwitcherPopoverProps {
  children: ReactNode
  show: boolean
  onHide: () => void
}

export const NetworkSwitcherPopover = ({ children, show, onHide }: NetworkSwitcherPopoverProps) => {
  const { connector, account, chainId } = useWeb3React(NETWORK_CONTEXT_NAME)
  const { error: walletConnectionError, connector: walletConnectionConnector } = useWeb3React()
  const popoverRef = useRef<HTMLDivElement | null>(null)
  useClickAway(popoverRef, () => {
    if (show) onHide()
  })

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
      return !!(connector?.supportedChainIds?.indexOf(networkId) === -1 || (chainId && chainId === networkId))
    },
    [chainId, connector, walletConnectionError]
  )

  return (
    <Wrapper>
      <StyledPopover
        innerRef={popoverRef}
        content={
          <Flex flexDirection="column" alignItems="center">
            {Object.entries(NETWORK_DETAIL).map(([chainId, networkDetail]) => {
              return (
                <Card
                  width="100%"
                  mb="8px"
                  p="8px 12px"
                  clickable
                  key={chainId}
                  justifyContent="space-between"
                  disabled={isOptionDisabled(Number(chainId))}
                  onClick={() => {
                    handleNetworkChange(Number(chainId))
                  }}
                >
                  <Flex alignItems="center" opacity={isOptionDisabled(Number(chainId)) ? '0.2' : '1'}>
                    <Box mr="12px">
                      <img height="24px" src={networkDetail.icon} alt={networkDetail.chainName} />
                    </Box>
                    <Text>{networkDetail.chainName}</Text>
                  </Flex>
                </Card>
              )
            })}
            <Text mt="8px" fontWeight={700} fontSize="10px" letterSpacing="3px">
              A DXDAO PRODUCT
            </Text>
          </Flex>
        }
        show={show}
        placement="bottom-end"
      >
        {children}
      </StyledPopover>
    </Wrapper>
  )
}
