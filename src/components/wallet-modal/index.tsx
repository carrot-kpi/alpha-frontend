import { Modal } from '../modal'
import { Flex, Box, Text } from 'rebass'
import styled from 'styled-components'
import { ChevronRight, Layers } from 'react-feather'
import { AddressZero } from '@ethersproject/constants'
import { Card } from '../card'
import { UndecoratedExternalLink } from '../undecorated-link'
import { getExplorerLink, shortenAddress } from '../../utils'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTransactions } from '../../state/transactions/hooks'

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
  const { account, chainId } = useActiveWeb3React()
  const transactions = useAllTransactions()

  return (
    <Modal open={!!open} onDismiss={onDismiss}>
      <RootFlex p="20px" flexDirection="column" width="100%">
        <Text mb="12px" fontSize="20px" fontWeight="700">
          Account
        </Text>
        <Card mb="20px" p="12px">
          <Text fontSize="24px">{shortenAddress(account || AddressZero)}</Text>
        </Card>
        <Text mb="12px" fontSize="16px" fontWeight="700">
          Transactions
        </Text>
        {Object.keys(transactions).length > 0 && chainId ? (
          Object.entries(transactions).map(([hash, transaction]) => {
            return (
              <Box key={hash}>
                <UndecoratedExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <EllipsizedText>{transaction.summary}</EllipsizedText>
                    <Box ml="12px">
                      <ChevronRight />
                    </Box>
                  </Flex>
                </UndecoratedExternalLink>
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
