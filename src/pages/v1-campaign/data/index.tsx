import { KpiTokenData as SdkKpiTokenData } from '@carrot-kpi/decoder'
import Skeleton from 'react-loading-skeleton'
import { Flex } from 'rebass'
import { Erc20KpiTokenData } from './erc20'

interface DataProps {
  data?: SdkKpiTokenData
}

export const KpiTokenData = ({ data }: DataProps) => {
  if (!data) {
    return (
      <Flex flexDirection="column">
        <Skeleton height="20px" width="20%" />
      </Flex>
    )
  }
  switch (data.type) {
    case 'AaveErc20-v1.0.0':
    case 'Erc20-v1.0.0': {
      return <Erc20KpiTokenData data={data} />
    }
  }
}
