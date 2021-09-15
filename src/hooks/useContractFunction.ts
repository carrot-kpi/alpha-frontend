import { useContractFunction as useContractFunctionCall } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants'

export const useContractFunction = (
  functionName: string,
  transactionName: string,
  contract?: Contract | null
): ((...args: any[]) => Promise<void>) | undefined => {
  let properContract = contract || new Contract(AddressZero, [])
  const { send } = useContractFunctionCall(properContract, functionName, { transactionName })
  if (properContract.address === AddressZero) return undefined
  return send
}
