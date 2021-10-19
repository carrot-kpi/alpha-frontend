import { BigNumber } from '@ethersproject/bignumber'
import { getAddress } from '@ethersproject/address'
import { NetworkDetails } from '../constants'
import { ChainId } from '@carrot-kpi/sdk'
import { gql } from 'graphql-request'
import { BLOCK_SUBGRAPH_CLIENTS } from '../constants/graphql'
import { DateTime } from 'luxon'

const ETHERSCAN_PREFIXES: { [chainId in number]: string } = {
  1: '',
  4: 'rinkeby.',
}

const getExplorerPrefix = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.XDAI:
      return 'https://blockscout.com/xdai/mainnet'
    default:
      return `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`
  }
}

export function getExplorerLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = getExplorerPrefix(chainId)

  // exception. blockscout doesn't have a token-specific address
  if (chainId === ChainId.XDAI && type === 'token') {
    return `${prefix}/address/${data}`
  }

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = getAddress(address)
  if (!parsed) throw Error(`Invalid 'address' parameter '${address}'.`)
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function addMarginToGasEstimation(gas: BigNumber): BigNumber {
  return gas.add(gas.mul(5).div(100))
}

export const switchOrAddNetwork = (networkDetails?: NetworkDetails, account?: string) => {
  if (!window.ethereum || !window.ethereum.request || !window.ethereum.isMetaMask || !networkDetails) return
  window.ethereum
    .request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkDetails.chainId }],
    })
    .catch((error) => {
      if (error.code !== 4902) {
        console.error('error switching to chain id', networkDetails.chainId, error)
      }
      if (!window.ethereum || !window.ethereum.request || !account) return
      window.ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [{ ...networkDetails }, account],
        })
        .catch((error) => {
          console.error('error adding chain with id', networkDetails.chainId, error)
        })
    })
}

export const getTimestampsFromRange = (from: DateTime, to: DateTime, granularity: number): number[] => {
  let loopedDate = from
  let timestamps = []
  while (loopedDate.toMillis() < to.toMillis()) {
    timestamps.push(loopedDate.toMillis())
    loopedDate = loopedDate.plus({ seconds: granularity })
  }
  return timestamps
}

export const getBlocksFromTimestamps = async (
  chainId: ChainId,
  timestamps: number[]
): Promise<{ number: number; timestamp: number }[]> => {
  if (!timestamps || timestamps.length === 0) return []

  const blocksSubgraph = BLOCK_SUBGRAPH_CLIENTS[chainId]
  if (!blocksSubgraph) return []

  const data = await blocksSubgraph.request<{
    [timestampString: string]: { number: string }[]
  }>(gql`
    query blocks {
      ${timestamps.map((timestamp) => {
        return `t${timestamp}: blocks(first: 1, orderBy: number, orderDirection: asc where: { timestamp_gt: ${Math.floor(
          timestamp / 1000
        )} }) {
        number
      }`
      })}
    }
  `)
  return Object.entries(data).reduce(
    (accumulator: { timestamp: number; number: number }[], [timestampString, blocks]) => {
      if (blocks.length > 0) {
        accumulator.push({
          timestamp: parseInt(timestampString.substring(1)),
          number: parseInt(blocks[0].number),
        })
      }
      return accumulator
    },
    []
  )
}
