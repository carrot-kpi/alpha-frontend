import { useEffect, useState } from 'react'
import { KpiToken, Amount } from '@carrot-kpi/sdk'
import { Token } from '@usedapp/core'

export function useRewardIfKpiIsReached(kpiToken?: KpiToken, balance?: Amount<Token> | null) {
  const [rewardIfKpiIsReached, setRewardIfKpiIsReached] = useState<Amount<Token> | null>(null)

  useEffect(() => {
    if (!kpiToken || !balance) {
      setRewardIfKpiIsReached(null)
      return
    }
    setRewardIfKpiIsReached(
      balance
        .multiply(kpiToken.collateral)
        .divide(new Amount<Token>(kpiToken.collateral.currency, kpiToken.totalSupply.raw))
    )
  }, [balance, kpiToken])

  return rewardIfKpiIsReached
}