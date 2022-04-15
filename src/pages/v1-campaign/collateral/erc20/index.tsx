import { AaveErc20V100Data, Erc20V100Data } from '@carrot-kpi/decoder'
import { commify } from '@ethersproject/units'
import { useMemo } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Box, Flex, Text } from 'rebass'
import { useTokensPriceUSD } from '../../../../hooks/useTokensPriceUSD'

interface Erc20KpiTokenCollateralProps {
  data: AaveErc20V100Data | Erc20V100Data
}

export const Erc20KpiTokenCollateral = ({ data }: Erc20KpiTokenCollateralProps) => {
  const erc20Tokens = useMemo(() => {
    return data.collaterals.map((collateral) => collateral.currency)
  }, [data.collaterals])
  const { loading, prices } = useTokensPriceUSD(erc20Tokens)

  return loading ? (
    <Flex flexDirection="column">
      {data.collaterals.map((collateral) => {
        return (
          <Box key={collateral.currency.address}>
            <Skeleton width="80px" />
          </Box>
        )
      })}
    </Flex>
  ) : (
    <Flex flexDirection="column">
      {data.collaterals.map((collateral) => {
        let collateralPriceUSD = prices[collateral.currency.address.toLowerCase()]
        return (
          <Text key={collateral.currency.address} mb="4px" fontFamily="Overpass Mono">
            {commify(collateral.toFixed(4))} {collateral.currency.symbol} ($
            {!collateralPriceUSD || collateralPriceUSD.isZero()
              ? '-'
              : commify(collateral.multiply(collateralPriceUSD).toFixed(2))}
            )
          </Text>
        )
      })}
    </Flex>
  )
}
