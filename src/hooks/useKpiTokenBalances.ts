import { useEffect, useMemo, useState } from 'react'
import { Interface } from '@ethersproject/abi'
import { KpiToken, KPI_TOKEN_ABI } from '@carrot-kpi/alpha-sdk'
import { Token, Amount } from '@carrot-kpi/sdk-core'
import { CallState, Result, useMultipleContractSingleData } from '../state/multicall/hooks'

const KPI_TOKEN_INTERFACE = new Interface(KPI_TOKEN_ABI)

export function useKpiTokenBalances(
  kpiTokens?: KpiToken[],
  account?: string | null
): { loading: boolean; balances: { [address: string]: Amount<Token> } } {
  const kpiTokenAddresses = useMemo(
    () => (kpiTokens ? kpiTokens.map((kpiToken) => kpiToken.address, []) : []),
    [kpiTokens]
  )
  const callParams = useMemo(() => [account || undefined], [account])
  const wrappedResults = useMultipleContractSingleData(kpiTokenAddresses, KPI_TOKEN_INTERFACE, 'balanceOf', callParams)

  const [loading, setLoading] = useState(true)
  const [balances, setBalances] = useState<{ [address: string]: Amount<Token> }>({})

  useEffect(() => {
    if (!account) {
      setLoading(false)
      setBalances({})
      return
    }
    if (!kpiTokens || kpiTokens.length === 0) return
    if (wrappedResults.some((wrappedResult) => wrappedResult.loading)) {
      setLoading(true)
      return
    }
    if (
      wrappedResults.some(
        (wrappedResult) => wrappedResult.error || !wrappedResult.result || wrappedResult.result.length === 0
      )
    ) {
      console.error('could not fetch balance')
      setLoading(true)
      return
    }
    setLoading(false)
    setBalances(
      wrappedResults.reduce((accumulator: { [address: string]: Amount<Token> }, wrappedResult, i) => {
        const kpiToken = kpiTokens[i]
        const balance = new Amount(kpiToken, ((wrappedResult as CallState).result as Result)[0])
        accumulator[kpiToken.address] = balance
        return accumulator
      }, {})
    )
  }, [account, kpiTokens, wrappedResults])

  return { loading, balances }
}
