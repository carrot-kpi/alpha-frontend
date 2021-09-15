import { KPI_TOKEN_ABI, KpiToken } from '@carrot-kpi/sdk'
import { useContract } from './useContract'
import { useContractFunction } from './useContractFunction'

export function useFinalizeKpiTokenCallback(kpiToken?: KpiToken) {
  return useContractFunction('finalize', `Finalize ${kpiToken?.ticker}`, useContract(kpiToken?.address, KPI_TOKEN_ABI))
}
