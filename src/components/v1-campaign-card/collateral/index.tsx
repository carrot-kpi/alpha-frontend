import { KpiTokenData } from '@carrot-kpi/decoder'

interface CollateralProps {
  data?: KpiTokenData
}

export const Collateral = ({ data }: CollateralProps) => {
  if (!data) return null
  switch (data.type) {
    case 'Erc20-v1.0.0':
    case 'AaveErc20-v1.0.0': {
      return <>{data.collaterals.length} ERC20s</>
    }
  }
}
