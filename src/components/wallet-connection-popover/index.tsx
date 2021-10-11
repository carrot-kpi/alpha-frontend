import { ReactNode } from 'react'
import { SUPPORTED_WALLETS } from '../../constants'
import { Popover } from '../popover'
import { Box, Flex, Text } from 'rebass'
import { Card } from '../card'
import { useWeb3React } from '@web3-react/core'

interface ConnectWalletProps {
  children: ReactNode
  show: boolean
  onHide: () => void
}

export const WalletConnectionPopover = ({ children, show, onHide }: ConnectWalletProps) => {
  const { activate, connector } = useWeb3React()

  return (
    <Popover
      content={
        <Flex flexDirection="column" alignItems="center">
          <Flex flexWrap="wrap">
            {SUPPORTED_WALLETS.map((supportedWallet, index) => {
              return (
                <Card
                  width="180px"
                  ml={index !== 0 ? '8px' : '0'}
                  key={index}
                  clickable
                  onClick={() => {
                    onHide()
                    if (supportedWallet.connector !== connector) activate(supportedWallet.connector)
                  }}
                >
                  <Flex flexDirection="column" alignItems="center">
                    <Box mb="4px">
                      <img height="48px" src={supportedWallet.icon} alt={supportedWallet.name} />
                    </Box>
                    <Text fontSize="18px">{supportedWallet.name}</Text>
                  </Flex>
                </Card>
              )
            })}
          </Flex>
        </Flex>
      }
      show={show}
      onHide={onHide}
    >
      {children}
    </Popover>
  )
}
