import { BigNumber } from '@ethersproject/bignumber'
import { getAddress } from 'ethers/lib/utils'

const ETHERSCAN_PREFIXES: { [chainId in number]: string } = {
  1: '',
  4: 'rinkeby.',
}

const getExplorerPrefix = (chainId: number) => {
  switch (chainId) {
    default:
      return `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`
  }
}

export function getExplorerLink(
  chainId: number,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = getExplorerPrefix(chainId)
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
