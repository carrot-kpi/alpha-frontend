import { useEffect, useState } from 'react'
import { KpiToken, TokenAmount } from 'carrot-sdk'

export function useRewardIfKpiIsReached(kpiToken?: KpiToken, balance?: TokenAmount | null) {
  const [rewardIfKpiIsReached, setRewardIfKpiIsReached] = useState<TokenAmount | null>(null)

  useEffect(() => {
    if (!kpiToken || !balance) {
      setRewardIfKpiIsReached(null)
      return
    }
    setRewardIfKpiIsReached(
      new TokenAmount(kpiToken.collateral.token, balance.divide(kpiToken.totalSupply).multiply(kpiToken.collateral))
    )
  }, [balance, kpiToken])

  return rewardIfKpiIsReached
}