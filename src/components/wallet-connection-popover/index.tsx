import { ReactNode } from 'react'
import { SUPPORTED_WALLETS } from '../../constants'
import { Popover } from '../popover'
import { Box, Flex, Text } from 'rebass'
import { Card } from '../card'
import { useWeb3React } from '@web3-react/core'
import { ADXdaoProduct } from '../a-dxdao-product'

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
        <Flex flexDirection="column" alignItems="center" mb="-8px">
          <Flex flexDirection={['column', 'row']} alignItems={['center']} mb="12px">
            {SUPPORTED_WALLETS.map((supportedWallet, index) => {
              return (
                <Card
                  width="180px"
                  ml={['0px', index !== 0 ? '8px' : '0px']}
                  mt={[index !== 0 ? '8px' : '0px', '0px']}
                  key={index}
                  clickable
                  onClick={() => {
                    onHide()
                    if (supportedWallet.connector !== connector) activate(supportedWallet.connector)
                  }}
                >
                  <Flex flexDirection="column" alignItems="center">
                    <Box mb="4px">
                      <img height="42px" src={supportedWallet.icon} alt={supportedWallet.name} />
                    </Box>
                    <Text fontSize="18px">{supportedWallet.name}</Text>
                  </Flex>
                </Card>
              )
            })}
          </Flex>
          <ADXdaoProduct />
        </Flex>
      }
      show={show}
      onHide={onHide}
    >
      {children}
    </Popover>
  )
}
