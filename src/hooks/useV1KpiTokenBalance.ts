import { useEffect, useMemo, useState } from 'react'
import { KpiToken, ERC20_ABI } from '@carrot-kpi/sdk-v1'
import { useSingleCallResult } from '../state/multicall/hooks'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'

export function useV1KpiTokenBalance(
  kpiToken?: KpiToken,
  account?: string | null
): { loading: boolean; balance?: BigNumber } {
  const [contract, functionName, params] = useMemo(() => {
    if (!kpiToken || !account) return [undefined, '', []]
    switch (kpiToken.data.type) {
      case 'Erc20-v1.0.0':
      case 'AaveErc20-v1.0.0': {
        return [new Contract(kpiToken.address, ERC20_ABI), 'balanceOf', [account]]
      }
    }
  }, [account, kpiToken])
  const wrappedResult = useSingleCallResult(contract, functionName, params)

  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<BigNumber | undefined>(undefined)

  useEffect(() => {
    if (!account || !kpiToken || !contract || !functionName || !params) return
    if (wrappedResult.loading) {
      setLoading(true)
      return
    }
    if (wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0) {
      console.error('could not fetch balance')
      setLoading(true)
      return
    }
    setLoading(false)
    setBalance(wrappedResult.result[0])
  }, [
    account,
    contract,
    functionName,
    kpiToken,
    params,
    wrappedResult.error,
    wrappedResult.loading,
    wrappedResult.result,
  ])

  return { loading, balance }
}
