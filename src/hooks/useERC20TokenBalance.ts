import { useEffect, useMemo, useState } from 'react'
import { useERC20Contract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { Amount, Token } from '@carrot-kpi/sdk-core'

export function useERC20TokenBalance(
  token?: Token,
  address?: string | null
): { loading: boolean; balance: Amount<Token> | null } {
  const erc20Contract = useERC20Contract(token)
  const callParams = useMemo(() => (address ? [address] : undefined), [address])
  const wrappedResult = useSingleCallResult(erc20Contract, 'balanceOf', callParams)

  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<Amount<Token> | null>(null)

  useEffect(() => {
    if (!token || !token.address || !erc20Contract) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch erc20 token balance')
      setLoading(true)
      return
    }
    setLoading(false)
    setBalance(new Amount(token, wrappedResult.result[0]))
  }, [erc20Contract, token, wrappedResult.error, wrappedResult.loading, wrappedResult.result])

  return { loading, balance }
}
