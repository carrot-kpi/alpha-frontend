import { KpiToken } from '@carrot-kpi/v1-sdk'
import { Erc20V100Action } from './erc20/v1.0.0'

interface KpiTokenActionProps {
  kpiToken: KpiToken
}

export const KpiTokenAction = ({ kpiToken }: KpiTokenActionProps) => {
  switch (kpiToken.data.type) {
    case 'Erc20-v1.0.0':
      return <Erc20V100Action address={kpiToken.address} data={kpiToken.data} />
  }
}
