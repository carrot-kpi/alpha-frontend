import { Oracle as SdkOracle } from '@carrot-kpi/v1-sdk'
import { GenericOracleData } from './generic-data'
import { SpecificOracleData } from './specific-data'
import { OracleAction } from './action'

interface OracleProps {
  oracle: SdkOracle
  kpiTokenExpired: boolean
}

export const Oracle = ({ oracle, kpiTokenExpired }: OracleProps) => {
  return (
    <>
      <GenericOracleData address={oracle.address} template={oracle.template} />
      <SpecificOracleData data={oracle.data} />
      {!kpiTokenExpired ? (
        <OracleAction address={oracle.address} data={oracle.data} />
      ) : (
        <>The KPI token expired. No action required.</>
      )}
    </>
  )
}
