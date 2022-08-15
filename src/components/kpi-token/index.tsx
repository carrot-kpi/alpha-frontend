import { KpiToken as SdkKpiToken } from '@carrot-kpi/v1-sdk'
import { KpiTokenAction } from './action'
import { GenericKpiTokenData } from './generic-data'
import { SpecificKpiTokenData } from './specific-data'

interface KpiTokenProps {
  kpiToken: SdkKpiToken
}

export const KpiToken = ({ kpiToken }: KpiTokenProps) => {
  return (
    <>
      <h2>KPI token</h2>
      <GenericKpiTokenData address={kpiToken.address} template={kpiToken.template} />
      <SpecificKpiTokenData data={kpiToken.data} />
      <KpiTokenAction kpiToken={kpiToken} />
    </>
  )
}
