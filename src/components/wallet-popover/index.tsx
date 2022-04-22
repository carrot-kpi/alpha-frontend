import { Flex, Box, Text } from 'rebass'
import styled, { useTheme } from 'styled-components'
import { ArrowUpRight, CheckCircle, Clipboard, Layers } from 'react-feather'
import { UndecoratedExternalLink } from '../undecorated-link'
import { getExplorerLink, shortenAddress } from '../../utils'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTransactions } from '../../state/transactions/hooks'
import { Title } from '../title'
import { Popover } from '../popover'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import metamaskLogo from '../../assets/metamask-logo.webp'
import walletConnectLogo from '../../assets/wallet-connect-logo.png'
import { Button } from '../button'
import { DateTime } from 'luxon'
import Loader from 'react-spinners/BarLoader'
import { ChainId } from '@carrot-kpi/sdk-core'
import { ADXdaoProduct } from '../a-dxdao-product'

const RootFlex = styled(Flex)`
  background-color: ${(props) => props.theme.surface};
  transition: background-color 0.2s ease;
  min-width: 320px;
  width: 320px;
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

export const WalletPopover = ({ children, show, onHide }: WalletPopoverProps) => {
  const { account, chainId, connector, deactivate } = useActiveWeb3React()
  const theme = useTheme()
  const transactions = useAllTransactions()
  const filteredSortedTransactions = useMemo(() => {
    if (!account) return []
    return Object.entries(transactions)
      .filter(([, transaction]) => transaction.from.toLowerCase() === account.toLowerCase())
      .sort(([, transactionA], [, transactionB]) => transactionB.addedTime - transactionA.addedTime)
      .map(([hash, transaction]) => ({ ...transaction, hash }))
  }, [account, transactions])
  const [addressCopiedToClipboard, setAddressCopiedToClipboard] = useState(false)

  const handleDisconnectWallet = useCallback(() => {
    deactivate()
  }, [deactivate])

  const handleCopyToClipboard = useCallback(() => {
    if (!account) return
    navigator.clipboard.writeText(account)
    setAddressCopiedToClipboard(true)
    setTimeout(() => {
      setAddressCopiedToClipboard(false)
    }, 2000)
  }, [account])

  return (
    <Popover
      content={
        <RootFlex flexDirection="column">
          <Flex width="100%" mb="16px" justifyContent="space-between" alignItems="center">
            <Flex mr="32px">
              <Box mr="8px">
                <img
                  width="16px"
                  height="16px"
                  src={connector instanceof InjectedConnector ? metamaskLogo : walletConnectLogo}
                  alt="Logo"
                />
              </Box>
              <Text fontSize="14px">
                {connector instanceof InjectedConnector
                  ? window.ethereum?.isMetaMask
                    ? 'Metamask'
                    : 'Injected'
                  : 'WalletConnect'}
              </Text>
            </Flex>
            {!!account && (
              <Box>
                <Button
                  mini
                  icon={addressCopiedToClipboard ? <CheckCircle size="16px" /> : <Clipboard size="16px" />}
                  onClick={handleCopyToClipboard}
                >
                  {shortenAddress(account)}
                </Button>
              </Box>
            )}
          </Flex>
          <Title mb="12px">Latest transactions</Title>
          <Flex width="100%" height="240px" overflowY="auto" overflowX="hidden" mb="8px" flexDirection="column">
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
                    <Box ml="12px">
                      {!!transaction.receipt ? (
                        <UndecoratedExternalLink
                          title="View on block explorer"
                          href={getExplorerLink(chainId || ChainId.GNOSIS, transaction.hash, 'transaction')}
                        >
                          <StyledArrowUpRight size="20px" />
                        </UndecoratedExternalLink>
                      ) : (
                        <Loader color={theme.accent} loading css="display: block;" width="20px" height="4px" />
                      )}
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
          <Button mb="12px" width="100%" onClick={handleDisconnectWallet}>
            Disconnect wallet
          </Button>
          <ADXdaoProduct />
        </RootFlex>
      }
      show={!!show}
      onHide={onHide}
    >
      {children}
    </Popover>
  )
}
