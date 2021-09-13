import { useEffect, useState } from 'react'
import { ERC20_ABI, KpiToken, Amount } from '@carrot-kpi/sdk'
import { useContract } from './useContract'
import { Token } from '@usedapp/core'

export function useKpiTokenBalance(kpiToken?: KpiToken, account?: string) {
  const kpiTokenContract = useContract(kpiToken?.address, ERC20_ABI)

  const [balance, setBalance] = useState<Amount<Token> | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !kpiTokenContract || !kpiToken) return
      setLoading(true)
      try {
        const token = new Token(kpiToken.name, kpiToken.ticker, kpiToken.chainId, kpiToken.address, kpiToken.decimals)
        const balance = await kpiTokenContract.balanceOf(account)
        setBalance(new Amount<Token>(token, balance))
      } catch (error) {
        console.error(`could not get kpi token balance for ${account}`, error)
      } finally {
        setLoading(false)
      }
    }
    fetchBalance()
  }, [account, kpiToken, kpiTokenContract])

  return { loading, balance }
}
