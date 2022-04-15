import { KpiTokenData } from '@carrot-kpi/decoder'
import Skeleton from 'react-loading-skeleton'
import { Flex } from 'rebass'
import { Erc20KpiTokenCollateral } from './erc20'

interface DataProps {
  data?: KpiTokenData
}

export const KpiTokenCollateral = ({ data }: DataProps) => {
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
      return <Erc20KpiTokenCollateral data={data} />
    }
    default: {
      console.warn(`unhandled data ${data}`)
      return null
    }
  }
}
