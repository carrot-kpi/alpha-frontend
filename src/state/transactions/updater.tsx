import { ChainId } from '@carrot-kpi/sdk-core'
import { useCallback, useEffect, useMemo } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Box, Flex, Text } from 'rebass'
import { useTheme } from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { retry, RetryableError, RetryOptions } from '../../utils/retry'
import { updateBlockNumber } from '../application/actions'
import { useBlockNumber } from '../application/hooks'
import { AppState } from '../index'
import { checkedTransaction, finalizeTransaction } from './actions'
import { TransactionState } from './reducer'

interface TxInterface {
  addedTime: number
  receipt?: Record<string, any>
  lastCheckedBlockNumber?: number
}

export function shouldCheck(lastBlockNumber: number, tx: TxInterface): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 1, minWait: 0, maxWait: 0 }

const RETRY_OPTIONS_BY_CHAIN_ID: { [chainId in ChainId]: RetryOptions } = {
  [ChainId.MAINNET]: DEFAULT_RETRY_OPTIONS,
  [ChainId.RINKEBY]: DEFAULT_RETRY_OPTIONS,
  [ChainId.GOERLI]: DEFAULT_RETRY_OPTIONS,
  [ChainId.GNOSIS]: DEFAULT_RETRY_OPTIONS,
}

export function TransactionsStateUpdater(): null {
  const { chainId, library } = useActiveWeb3React()

  const lastBlockNumber = useBlockNumber()
  const theme = useTheme()

  const dispatch = useDispatch()
  const state = useSelector<AppState, TransactionState>((state) => state.transactions)

  const transactions = useMemo(() => (chainId ? state[chainId] ?? {} : {}), [chainId, state])

  const getReceipt = useCallback(
    (hash: string) => {
      if (!library || !chainId) throw new Error('No library or chainId')
      const retryOptions = RETRY_OPTIONS_BY_CHAIN_ID[chainId]
      return retry(
        () =>
          library.getTransactionReceipt(hash).then((receipt) => {
            if (receipt === null) {
              console.debug('Retrying for hash', hash)
              throw new RetryableError()
            }
            return receipt
          }),
        retryOptions
      )
    },
    [chainId, library]
  )

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return

    const cancels = Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .map((hash) => {
        const { promise, cancel } = getReceipt(hash)
        promise
          .then((receipt: any) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                })
              )

              toast.info(
                <Flex alignItems="center">
                  <Box pr="12px">
                    {receipt.status === 1 ? (
                      <CheckCircle color={theme.positiveSurfaceContent} size={24} />
                    ) : (
                      <AlertCircle color={theme.negativeSurfaceContent} size={24} />
                    )}
                  </Box>
                  <Flex flexDirection="column">
                    <Text mb="4px" color={theme.surfaceContent}>
                      {transactions[hash]?.summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
                    </Text>
                  </Flex>
                </Flex>
              )

              // the receipt was fetched before the block, fast forward to that block to trigger balance updates
              if (receipt.blockNumber > lastBlockNumber) {
                dispatch(updateBlockNumber({ chainId, blockNumber: receipt.blockNumber }))
              }
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
            }
          })
          .catch((error: any) => {
            if (!error.isCancelledError) {
              console.error(`Failed to check transaction hash: ${hash}`, error)
            }
          })
        return cancel
      })

    return () => {
      cancels.forEach((cancel) => cancel())
    }
  }, [chainId, library, transactions, lastBlockNumber, dispatch, getReceipt, theme])

  return null
}
