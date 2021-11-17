import { Currency, Amount } from '@carrot-kpi/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useNativeCurrency } from './useNativeCurrency'

export function useNativeCurrencyBalance(account?: string | null): { loading: boolean; balance: Amount<Currency> } {
  const { library } = useActiveWeb3React()
  const nativeCurrency = useNativeCurrency()
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(new Amount(nativeCurrency, BigNumber.from(0)))

  useEffect(() => {
    let cancelled = false
    const fetchBalance = async () => {
      if (!library || !account) return
      if (!cancelled) setLoading(true)
      try {
        const balance = await library.getBalance(account)
        if (!cancelled) setBalance(new Amount(nativeCurrency, balance))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchBalance()
    return () => {
      cancelled = true
    }
  }, [account, library, nativeCurrency])

  return { loading, balance }
}
