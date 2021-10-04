import { KPI_TOKEN_ABI, KpiToken } from '@carrot-kpi/sdk'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useContract } from './useContract'
import { useKpiTokenBalance } from './useKpiTokenBalance'
import { useRewardIfKpiIsReached } from './useRewardIfKpiIsReached'
import { useTokenPriceUSD } from './useTokenPriceUSD'

export function useRedeemKpiTokenCallback(kpiToken?: KpiToken) {
  const { account } = useActiveWeb3React()
  const collateralPriceUSD = useTokenPriceUSD(kpiToken?.collateral.currency)
  const { balance } = useKpiTokenBalance(kpiToken, account || undefined)
  const rewardIfKpiIsReached = useRewardIfKpiIsReached(kpiToken, balance)
  const redeemedCollateral = useMemo(
    () => rewardIfKpiIsReached?.multiply(collateralPriceUSD),
    [collateralPriceUSD, rewardIfKpiIsReached]
  )

  const kpiTokenContract = useContract(kpiToken?.address, KPI_TOKEN_ABI, true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!kpiTokenContract || !kpiToken) return
    try {
      const tx = await kpiTokenContract.redeem()
      addTransaction(tx, {
        summary: `Redeem ${rewardIfKpiIsReached?.toFixed(3)} ${
          rewardIfKpiIsReached?.currency.symbol
        } ($${redeemedCollateral?.toFixed(2)}) from ${kpiToken?.symbol}`,
      })
    } catch (error) {
      console.error('error redeeming carrot', error)
    }
  }, [addTransaction, kpiToken, kpiTokenContract, redeemedCollateral, rewardIfKpiIsReached])
}
