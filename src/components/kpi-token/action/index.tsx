import { KpiToken } from '@carrot-kpi/v1-sdk'
import { Erc201Action } from './erc20/1'

interface KpiTokenActionProps {
  kpiToken: KpiToken
}

export const KpiTokenAction = ({ kpiToken }: KpiTokenActionProps) => {
  switch (kpiToken.data.type) {
    case 'Erc20-1':
      return <Erc201Action address={kpiToken.address} data={kpiToken.data} />
  }
}
