import { SUPPORTED_WALLETS } from '../../constants'
import { Modal } from '../modal'
import { Card } from '../card'
import { Flex, Box, Text } from 'rebass'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { usePrevious } from 'react-use'
import { useEffect } from 'react'

interface WalletConnectionModalProps {
  open?: boolean
  onDismiss: () => void
}

const RootFlex = styled(Flex)`
  background-color: ${(props) => props.theme.white};
`

export const WalletConnectionModal = ({ open, onDismiss }: WalletConnectionModalProps) => {
  const { activate, account } = useEthers()
  const previousAccount = usePrevious(account)

  useEffect(() => {
    if(!previousAccount && account && open) onDismiss()
  }, [account, onDismiss, open, previousAccount])

  return (
    <Modal open={!!open} onDismiss={onDismiss}>
      <RootFlex p="20px" flexDirection="column" width="100%">
        <Box mb="20px">
          <Text fontSize="20px" fontWeight="700">
            Select a wallet
          </Text>
        </Box>
        {SUPPORTED_WALLETS.map((wallet, index) => {
          return (
            <Box
              key={index}
              onClick={() => {
                activate(wallet.connector)
              }}
            >
              <Card clickable mb="12px" p="12px 20px" width="100%">
                <Flex justifyContent="space-between">
                  <Flex alignItems="center">
                    <Box mr="16px">
                      <img height="24px" src={wallet.icon} alt={`${wallet.name} icon`} />
                    </Box>
                    <Box>{wallet.name}</Box>
                  </Flex>
                </Flex>
              </Card>
            </Box>
          )
        })}
        <Box mt="12px">
          <Text textAlign="center" fontWeight="700" fontSize="10px" letterSpacing="3px">
            A DXDAO PRODUCT
          </Text>
        </Box>
      </RootFlex>
    </Modal>
  )
}
