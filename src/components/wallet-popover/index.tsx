import { Flex, Box, Text } from 'rebass'
import styled from 'styled-components'
import { ArrowUpRight, Layers } from 'react-feather'
import { UndecoratedExternalLink } from '../undecorated-link'
import { getExplorerLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTransactions } from '../../state/transactions/hooks'
import { Title } from '../title'
import { IdentityBadge } from '../identity-badge'
import { Popover } from '../popover'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import metamaskLogo from '../../assets/metamask-logo.webp'
import walletConnectionLogo from '../../assets/wallet-connect-logo.png'
import { Button } from '../button'
import { DateTime } from 'luxon'
import { TransactionDetails } from '../../state/transactions/reducer'

const RootFlex = styled(Flex)`
  background-color: ${(props) => props.theme.surface};
  transition: background-color 0.2s ease;
`

const EllipsizedText = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const DateText = styled(EllipsizedText)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: ${(props) => props.theme.contentSecondary};
`

const StyledArrowUpRight = styled(ArrowUpRight)`
  color: ${(props) => props.theme.accent};
`

interface WalletPopoverProps {
  children: ReactNode
  show?: boolean
  onHide: () => void
}

interface Transaction extends TransactionDetails {
  hash: string
}

export const WalletPopover = ({ children, show, onHide }: WalletPopoverProps) => {
  const { account, chainId, connector, deactivate } = useActiveWeb3React()
  const transactions = useAllTransactions()
  const [filteredSortedTransactions, setFilteredSortedTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!account) setFilteredSortedTransactions([])
    else
      setFilteredSortedTransactions(
        Object.entries(transactions)
          .filter(([, transaction]) => transaction.from.toLowerCase() === account.toLowerCase())
          .sort(([, transactionA], [, transactionB]) => transactionB.addedTime - transactionA.addedTime)
          .map(([hash, transaction]) => ({ ...transaction, hash }))
      )
  }, [account, transactions])

  const handleDisconnectWallet = useCallback(() => {
    deactivate()
  }, [deactivate])

  return (
    <Popover
      content={
        <RootFlex flexDirection="column">
          <Flex mb="16px" alignItems="center">
            <Flex mr="32px">
              <Box mr="8px">
                <img
                  width="16px"
                  height="16px"
                  src={connector instanceof InjectedConnector ? metamaskLogo : walletConnectionLogo}
                  alt="Logo"
                />
              </Box>
              <Text fontSize="14px">Metamask</Text>
            </Flex>
            <Box>
              <IdentityBadge account={account || ''} />
            </Box>
          </Flex>
          <Title mb="12px">Latest transactions</Title>
          <Flex width="100%" height="240px" overflowY="auto" mb="8px" flexDirection="column">
            {filteredSortedTransactions.length > 0 && !!chainId ? (
              filteredSortedTransactions.map((transaction) => {
                return (
                  <Flex
                    key={transaction.hash}
                    width="100%"
                    height="60px"
                    minHeight="60px"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex flexDirection="column">
                      <EllipsizedText>{transaction.summary}</EllipsizedText>
                      <DateText fontSize="12px">
                        {DateTime.fromMillis(transaction.addedTime).toLocaleString(DateTime.DATETIME_SHORT)}
                      </DateText>
                    </Flex>
                    <Box>
                      <UndecoratedExternalLink href={getExplorerLink(chainId, transaction.hash, 'transaction')}>
                        <StyledArrowUpRight size="20px" />
                      </UndecoratedExternalLink>
                    </Box>
                  </Flex>
                )
              })
            ) : (
              <Flex width="100%" height="100%" flexDirection="column" alignItems="center" justifyContent="center">
                <Box mb="24px">
                  <Layers size="60px" />
                </Box>
                <Box>Nothing here yet.</Box>
              </Flex>
            )}
          </Flex>
          <Box>
            <Button width="100%" onClick={handleDisconnectWallet}>
              Disconnect wallet
            </Button>
          </Box>
        </RootFlex>
      }
      show={!!show}
      onHide={onHide}
    >
      {children}
    </Popover>
  )
}
