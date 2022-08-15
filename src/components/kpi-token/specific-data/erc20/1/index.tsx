import { Erc201Data } from '@carrot-kpi/v1-sdk'
import { formatUnits } from '@ethersproject/units'

interface Erc201SpecificDataProps {
  data: Erc201Data
}

export const Erc201SpecificData = ({ data }: Erc201SpecificDataProps) => {
  return (
    <>
      <h3>ERC20 KPI token data</h3>
      <ul>
        <li>ERC20 KPI token name: {data.name}</li>
        <li>ERC20 KPI token symbol: {data.symbol}</li>
        <li>ERC20 KPI token supply: {formatUnits(data.initialSupply, 18)}</li>
        <li>
          <h4>Collaterals</h4>
          <ul>
            {data.collaterals.map((collateral) => {
              return (
                <li key={collateral.amount.currency.address}>
                  {collateral.amount.toFixed(4)} {collateral.amount.currency.symbol} (minimum payout{' '}
                  {collateral.minimumPayout.toFixed(4)} {collateral.amount.currency.symbol})
                </li>
              )
            })}
          </ul>
        </li>
        <li>
          <h4>Oracles data</h4>
          <ul>
            {data.oracles.map((oracle) => {
              return (
                <ul key={oracle.addrezz}>
                  <li>
                    Bounds: {oracle.lowerBound.toString()} to {oracle.higherBound.toString()}
                  </li>
                  <li>Final result: {oracle.finalized ? oracle.finalResult.toString() : 'awaiting finalization'}</li>
                  <li>Weight: {oracle.weight.toString()}</li>
                </ul>
              )
            })}
          </ul>
        </li>
      </ul>
    </>
  )
}
