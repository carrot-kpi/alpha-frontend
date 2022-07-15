import { OracleData } from '@carrot-kpi/v1-sdk'
import { ManualRealityV100Action } from './manual/reality/v1.0.0'

interface OracleActionProps {
  address: string
  data: OracleData
}

export const OracleAction = ({ address, data }: OracleActionProps) => {
  switch (data.type) {
    case 'ManualReality-v1.0.0':
      return <ManualRealityV100Action address={address} data={data} />
  }
}
