import { useCallback } from 'react'
import { KPI_TOKEN_ABI, KpiToken } from 'carrot-sdk'
import { useContract } from './useContract'

export function useRedeemKpiTokenCallback(kpiToken?: KpiToken) {
  const kpiTokenContract = useContract(kpiToken?.address, KPI_TOKEN_ABI)

  return useCallback(() => {
    if (!kpiTokenContract) return
    const redeem = async () => {
      try {
        await kpiTokenContract.redeem()
      } catch (error) {
        console.error('error redeeming reward from kpi token', error)
      }
    }
    redeem()
  }, [kpiTokenContract])
}
