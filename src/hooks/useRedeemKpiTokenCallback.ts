import { KPI_TOKEN_ABI, KpiToken } from '@carrot-kpi/sdk'
import { useMemo } from 'react'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useContract } from './useContract'
import { useContractFunction } from './useContractFunction'
import { useKpiTokenBalance } from './useKpiTokenBalance'
import { useRewardIfKpiIsReached } from './useRewardIfKpiIsReached'
import { useTokenPriceUSD } from './useTokenPriceUSD'

export function useRedeemKpiTokenCallback(kpiToken?: KpiToken) {
  const { account } = useActiveWeb3React()
  const { priceUSD: collateralPriceUSD } = useTokenPriceUSD(kpiToken?.collateral.currency)
  const { balance } = useKpiTokenBalance(kpiToken, account || undefined)
  const rewardIfKpiIsReached = useRewardIfKpiIsReached(kpiToken, balance)
  const redeemedCollateral = useMemo(
    () => rewardIfKpiIsReached?.multiply(collateralPriceUSD),
    [collateralPriceUSD, rewardIfKpiIsReached]
  )

  return useContractFunction(
    'redeem',
    `Redeem ${rewardIfKpiIsReached?.toFixed(3)} ${
      rewardIfKpiIsReached?.currency.ticker
    } ($${redeemedCollateral?.toFixed(2)}) from ${kpiToken?.ticker}`,
    useContract(kpiToken?.address, KPI_TOKEN_ABI)
  )
}
