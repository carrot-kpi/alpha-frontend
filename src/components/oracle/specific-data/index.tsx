import { OracleData } from '@carrot-kpi/v1-sdk'
import { ManualRealityV100SpecificData } from './manual/reality/v1.0.0'

interface GenericOracleSpecificDataProps {
  data: OracleData
}

export const SpecificOracleData = ({ data }: GenericOracleSpecificDataProps) => {
  switch (data.type) {
    case 'ManualReality-v1.0.0':
      return <ManualRealityV100SpecificData data={data} />
  }
}
