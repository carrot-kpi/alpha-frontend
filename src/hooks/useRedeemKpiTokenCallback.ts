import { KPI_TOKEN_ABI, KpiToken } from '@carrot-kpi/alpha-sdk'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useContract } from './useContract'
import { useKpiTokenBalances } from './useKpiTokenBalances'
import { useRewardIfKpiIsReached } from './useRewardIfKpiIsReached'
import { useTokenPriceUSD } from './useTokenPriceUSD'

export function useRedeemKpiTokenCallback(kpiToken?: KpiToken) {
  const { account } = useActiveWeb3React()
  const { loading: loadingCollateralPriceUSD, price: collateralPriceUSD } = useTokenPriceUSD(
    kpiToken?.collateral.currency
  )
  const kpiTokens = useMemo(() => (kpiToken ? [kpiToken] : []), [kpiToken])
  const { balances } = useKpiTokenBalances(kpiTokens, account || undefined)
  const balance = useMemo(() => (kpiToken ? balances[kpiToken.address] : undefined), [balances, kpiToken])
  const rewardIfKpiIsReached = useRewardIfKpiIsReached(kpiToken, balance)
  const redeemedCollateral = useMemo(() => {
    if (loadingCollateralPriceUSD || !rewardIfKpiIsReached) return undefined
    return rewardIfKpiIsReached.multiply(collateralPriceUSD)
  }, [collateralPriceUSD, loadingCollateralPriceUSD, rewardIfKpiIsReached])

  const kpiTokenContract = useContract(kpiToken?.address, KPI_TOKEN_ABI, true)
  const addTransaction = useTransactionAdder()

  return useCallback(async () => {
    if (!kpiTokenContract || !kpiToken || loadingCollateralPriceUSD) return
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
  }, [addTransaction, kpiToken, kpiTokenContract, loadingCollateralPriceUSD, redeemedCollateral, rewardIfKpiIsReached])
}
