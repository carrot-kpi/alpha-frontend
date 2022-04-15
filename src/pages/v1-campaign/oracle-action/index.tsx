import { Oracle } from '@carrot-kpi/v1-sdk'
import { ManualRealityV100OracleAction } from './manual-reality/v1.0.0'

interface DataProps {
  oracle: Oracle
}

export const OracleAction = ({ oracle }: DataProps) => {
  switch (oracle.data.type) {
    case 'ManualReality-v1.0.0': {
      return <ManualRealityV100OracleAction data={oracle.data} />
    }
  }
}




