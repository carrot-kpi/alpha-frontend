import { useEffect, useState } from 'react'
import { ERC20_ABI, KpiToken, Token, TokenAmount } from 'carrot-sdk'
import { useContract } from './useContract'

export function useKpiTokenBalance(kpiToken?: KpiToken, account?: string) {
  const kpiTokenContract = useContract(kpiToken?.address, ERC20_ABI)

  const [balance, setBalance] = useState<TokenAmount | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !kpiTokenContract || !kpiToken) return
      setLoading(true)
      try {
        const token = new Token(kpiToken.chainId, kpiToken.address, kpiToken.decimals, kpiToken.symbol, kpiToken.name)
        const balance = await kpiTokenContract.balanceOf(account)
        setBalance(new TokenAmount(token, balance))
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
