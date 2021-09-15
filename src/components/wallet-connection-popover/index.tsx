import { ReactNode, useRef } from 'react'
import styled from 'styled-components'
import { SUPPORTED_WALLETS } from '../../constants'
import { Popover } from '../popover'
import { useClickAway } from 'react-use'
import { useEthers } from '@usedapp/core'
import { Box, Flex, Text } from 'rebass'
import { Card } from '../card'
import { CheckCircle } from 'react-feather'

const Wrapper = styled.div`
  width: 100%;
`

const ConnectedWalletIcon = styled(CheckCircle)`
  color: ${(props) => props.theme.success};
`

const StyledPopover = styled(Popover)`
  padding: 22px;
  border-style: solid;
  border-width: 1.2px;
  border-radius: 12px;
  border-image: none;
`

interface ConnectWalletProps {
  children: ReactNode
  show: boolean
  onHide: () => void
}

export const WalletConnectionPopover = ({ children, show, onHide }: ConnectWalletProps) => {
  const { activate, connector, active } = useEthers()
  const popoverRef = useRef<HTMLDivElement | null>(null)
  useClickAway(popoverRef, () => {
    if (show) onHide()
  })

  return (
    <Wrapper>
      <StyledPopover
        innerRef={popoverRef}
        content={
          <Flex flexDirection="column" alignItems="center">
            {SUPPORTED_WALLETS.map((supportedWallet, index) => {
              return (
                <Card
                  width="100%"
                  mb="8px"
                  p="8px 12px"
                  clickable
                  key={index}
                  justifyContent="space-between"
                  onClick={() => {
                    onHide()
                    if (supportedWallet.connector !== connector) activate(supportedWallet.connector)
                  }}
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex alignItems="center">
                      <Box mr="12px">
                        <img height="24px" src={supportedWallet.icon} alt={supportedWallet.name} />
                      </Box>
                      <Text>{supportedWallet.name}</Text>
                    </Flex>
                    {active && supportedWallet.connector === connector && (
                      <Box>
                        <ConnectedWalletIcon size="16px" />
                      </Box>
                    )}
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
