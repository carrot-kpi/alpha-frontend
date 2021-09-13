import { useCallback } from 'react'
import { KPI_TOKEN_ABI, KpiToken } from '@carrot-kpi/sdk'
import { useContract } from './useContract'

export function useFinalizeKpiTokenCallback(kpiToken?: KpiToken) {
  const kpiTokenContract = useContract(kpiToken?.address, KPI_TOKEN_ABI)

  return useCallback(() => {
    if (!kpiTokenContract) return
    const finalize = async () => {
      try {
        await kpiTokenContract.finalize()
      } catch (error) {
        console.error('error finalizing kpi token', error)
      }
    }
    finalize()
  }, [kpiTokenContract])
}
