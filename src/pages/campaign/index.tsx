import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { useKpiToken } from '../../hooks/useKpiToken'
import { formatUnits } from '@ethersproject/units'

export enum Status {
  AWAITING_EXPIRY,
  AWAITING_ANSWER,
  AWAITING_FINALIZATION,
  KPI_REACHED,
  KPI_NOT_REACHED,
}

export function Campaign(): ReactElement {
  const { address: kpiTokenAddress } = useParams()
  const { loading, kpiToken } = useKpiToken(kpiTokenAddress)

  if (loading || !kpiToken) return <>Loading...</>
  return (
    <>
      <h2>KPI token generic data</h2>
      <ul>
        <li>Address: {kpiToken.address}</li>
        <li>Template name: {kpiToken.templateSpecification.name}</li>
        <li>
          Template version: v{kpiToken.templateVersion.major}.{kpiToken.templateVersion.minor}.
          {kpiToken.templateVersion.patch}
        </li>
        <li>Template description: {kpiToken.templateSpecification.description}</li>
        <li>Template tags: {kpiToken.templateSpecification.tags.join(', ')}</li>
      </ul>
      {kpiToken.data.type === 'Erc20-v1.0.0' && (
        <>
          <h2>ERC20 KPI token data</h2>
          <ul>
            <li>ERC20 KPI token name: {kpiToken.data.name}</li>
            <li>ERC20 KPI token symbol: {kpiToken.data.symbol}</li>
            <li>ERC20 KPI token supply: {formatUnits(kpiToken.data.initialSupply, 18)}</li>
            <li>
              <h4>Collaterals</h4>
              <ul>
                {kpiToken.data.collaterals.map((collateral) => {
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
                {kpiToken.data.oracles.map((oracle) => {
                  return (
                    <ul key={oracle.addrezz}>
                      <li>
                        Bounds: {oracle.lowerBound.toString()} to {oracle.higherBound.toString()}
                      </li>
                      <li>
                        Final result: {oracle.finalized ? oracle.finalResult.toString() : 'awaiting finalization'}
                      </li>
                      <li>Weight: {oracle.weight.toString()}</li>
                    </ul>
                  )
                })}
              </ul>
            </li>
          </ul>
        </>
      )}
      <div style={{ height: 16 }} />
      <h2>Oracles</h2>
      {kpiToken.oracles.map((oracle) => {
        return (
          <ul key={oracle.address}>
            <li>Address: {oracle.address}</li>
            <li>Template name: {oracle.templateSpecification.name}</li>
            <li>
              Template version: v{oracle.templateVersion.major}.{kpiToken.templateVersion.minor}.
              {oracle.templateVersion.patch}
            </li>
            <li>Template description: {oracle.templateSpecification.description}</li>
            <li>Template tags: {oracle.templateSpecification.tags.join(', ')}</li>
            {oracle.data.type === 'ManualReality-v1.0.0' && (
              <>
                <li>Reality address: {oracle.data.realityAddress}</li>
                <li>Arbitrator address: {oracle.data.arbitratorAddress}</li>
                <li>Question: {oracle.data.question}</li>
                <li>Timeout: {oracle.data.timeout}</li>
                <li>Opening timestamp: {oracle.data.openingTimestamp}</li>
              </>
            )}
          </ul>
        )
      })}
    </>
  )
}
