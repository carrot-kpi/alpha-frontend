import { Modal } from '../modal'
import { Flex, Box, Text } from 'rebass'
import styled from 'styled-components'
import { shortenAddress, useEthers, useTransactions } from '@usedapp/core'
import { ChevronRight, Layers } from 'react-feather'
import { AddressZero } from '@ethersproject/constants'
import { Card } from '../card'

interface WalletConnectionModalProps {
  open?: boolean
  onDismiss: () => void
}

const RootFlex = styled(Flex)`
  background-color: ${(props) => props.theme.white};
`

const EllipsizedText = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const WalletModal = ({ open, onDismiss }: WalletConnectionModalProps) => {
  const { account } = useEthers()
  const { transactions: wrappedTransactions } = useTransactions()

  return (
    <Modal open={!!open} onDismiss={onDismiss}>
      <RootFlex p="20px" flexDirection="column" width="100%">
        <Text mb="12px" fontSize="20px" fontWeight="700">
          Account
        </Text>
        <Card mb="12px">
          <Text fontSize="24px">{shortenAddress(account || AddressZero)}</Text>
        </Card>
        <Text mb="12px" fontSize="16px" fontWeight="700">
          Transactions
        </Text>
        {wrappedTransactions.length > 0 ? (
          wrappedTransactions.map((wrappedTransaction) => {
            return (
              <Box key={wrappedTransaction.transaction.hash}>
                <Flex justifyContent="space-between" alignItems="center">
                  <EllipsizedText>{wrappedTransaction.transactionName}</EllipsizedText>
                  <Box ml="12px">
                    <ChevronRight />
                  </Box>
                </Flex>
              </Box>
            )
          })
        ) : (
          <Flex flexDirection="column" alignItems="center" my="24px">
            <Box mb="24px">
              <Layers size="60px" />
            </Box>
            <Box>Nothing here yet.</Box>
          </Flex>
        )}
      </RootFlex>
    </Modal>
  )
}
