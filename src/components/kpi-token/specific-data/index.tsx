import { KpiTokenData } from '@carrot-kpi/v1-sdk'
import { Erc201SpecificData } from './erc20/1'

interface GenericKpiTokenDataProps {
  data: KpiTokenData
}

export const SpecificKpiTokenData = ({ data }: GenericKpiTokenDataProps) => {
  switch (data.type) {
    case 'Erc20-1':
      return <Erc201SpecificData data={data} />
  }
}
