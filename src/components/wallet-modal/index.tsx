import { Modal } from '../modal'
import { Flex, Box, Text } from 'rebass'
import styled from 'styled-components'
import { ChevronRight, Layers } from 'react-feather'
import { UndecoratedExternalLink } from '../undecorated-link'
import { getExplorerLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTransactions } from '../../state/transactions/hooks'
import { Title } from '../title'
import { IdentityBadge } from '../identity-badge'

interface WalletConnectionModalProps {
  open?: boolean
  onDismiss: () => void
}

const RootFlex = styled(Flex)`
  background-color: ${(props) => props.theme.surface};
  transition: background-color 0.2s ease;
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
        <Title mb="20px" fontSize="16px">
          Account
        </Title>
        <Box mb="20px">
          <IdentityBadge account={account || ''} />
        </Box>
        <Title mb="12px">Transactions</Title>
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
