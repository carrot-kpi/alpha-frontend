import { KpiTokenData } from '@carrot-kpi/v1-sdk'
import { Erc20100 } from './erc20/v1.0.0'

interface GenericKpiTokenDataProps {
  data: KpiTokenData
}

export const SpecificKpiTokenData = ({ data }: GenericKpiTokenDataProps) => {
  switch (data.type) {
    case 'Erc20-v1.0.0':
      return <Erc20100 data={data} />
  }
}
