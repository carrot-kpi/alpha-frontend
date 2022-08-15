import { OracleData } from '@carrot-kpi/v1-sdk'
import { Reality1Action } from './reality/1'

interface OracleActionProps {
  address: string
  data: OracleData
}

export const OracleAction = ({ address, data }: OracleActionProps) => {
  switch (data.type) {
    case 'Reality-1':
      return <Reality1Action address={address} data={data} />
  }
}
