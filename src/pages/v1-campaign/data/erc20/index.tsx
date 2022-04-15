import { AaveErc20V100Data, Erc20V100Data } from '@carrot-kpi/decoder'
import { commify, formatUnits } from '@ethersproject/units'
import Decimal from 'decimal.js-light'
import { Flex, Text } from 'rebass'
import { Title } from '../../../../components/title'

interface Erc20KpiTokenDataProps {
  data: AaveErc20V100Data | Erc20V100Data
}

export const Erc20KpiTokenData = ({ data }: Erc20KpiTokenDataProps) => {
  return (
    <>
      <Flex flexDirection="column" mb="12px">
        <Title mb="4px">Name:</Title>
        <Text>{data.name}</Text>
      </Flex>
      <Flex flexDirection="column" mb="12px">
        <Title mb="4px">Initial supply:</Title>
        <Text fontFamily="Overpass Mono">
          {commify(new Decimal(formatUnits(data.initialSupply, 18)).toFixed(2))} {data.symbol}
        </Text>
      </Flex>
      <Flex flexDirection="column" mb="12px">
        <Title mb="4px">Collaterals:</Title>
        {data.collaterals.map((collateralAmount, i) => {
          return (
            <Text key={collateralAmount.currency.address} fontFamily="Overpass Mono">
              {commify(collateralAmount.toFixed(2))} {collateralAmount.currency.symbol} (minimum payout{' '}
              {commify(data.minimumPayouts[i].toFixed(2))} {collateralAmount.currency.symbol})
            </Text>
          )
        })}
      </Flex>
      <Flex flexDirection="column" mb="12px">
        <Title mb="4px">Oracles configuration:</Title>
        {data.oracles.map((oracleConfiguration, i) => {
          return (
            <>
              <Text key={i}>Lower bound: {commify(oracleConfiguration.lowerBound.toString())}</Text>
              <Text key={i}>Higher bound: {commify(oracleConfiguration.higherBound.toString())}</Text>
              <Text key={i}>Weight: {commify(oracleConfiguration.weight.toString())}</Text>
            </>
          )
        })}
      </Flex>
    </>
  )
}
