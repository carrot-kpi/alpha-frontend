import { OracleData } from '@carrot-kpi/v1-sdk'
import { Reality1SpecificData } from './reality/1'

interface GenericOracleSpecificDataProps {
  data: OracleData
}

export const SpecificOracleData = ({ data }: GenericOracleSpecificDataProps) => {
  switch (data.type) {
    case 'Reality-1':
      return <Reality1SpecificData data={data} />
  }
}
