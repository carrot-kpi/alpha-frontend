import { ReactNode } from 'react'
import { DedicatedStepDefinition, FormField, SummaryStep } from '../../types'

const getPrintableFormFieldValue = (fieldType: FormField['type'], value: any): ReactNode => {
  switch (fieldType) {
    case 'erc20-token-amount':
      return `${value.amount} ${value.address}`
    case 'number':
    case 'string':
      return value
    case 'hidden':
      return null
    case 'select':
      return value.toString()
  }
}

const getFieldSummary = (value: { spec: FormField | DedicatedStepDefinition; internalState: any }): ReactNode => {
  const { spec, internalState } = value
  if (!spec || spec.type === 'hidden') return null
  switch (spec.type) {
    case 'onchain-setup':
    case 'summary':
      return null
    case 'description': {
      return (
        <>
          {Object.entries(value.internalState).map(([key, oracleField]: any) => {
            return <>{getFieldSummary(oracleField)}</>
          })}
        </>
      )
    }
    case 'oracles-picker': {
      return (
        <>
          <p>Oracles:</p>
          {value.internalState.map((oracle: any) => {
            return (
              <>
                {Object.entries(oracle.internalState).map(([key, oracleField]: any) => {
                  return getFieldSummary(oracleField)
                })}
                <br />
              </>
            )
          })}
        </>
      )
    }
    case 'erc20-token-amount':
    case 'number':
    case 'select':
    case 'string':
      return (
        <>
          {spec.label}: {getPrintableFormFieldValue(spec.type, internalState)}
          <br />
        </>
      )
  }
}

interface SummaryProps {
  spec: SummaryStep
  state: any
  onConfirm?: () => void
}

export const Summary = ({ spec, state, onConfirm }: SummaryProps) => {
  return (
    <>
      {spec.description && (
        <>
          {spec.description}
          <br />
        </>
      )}
      {Object.values(state).map((value: any) => {
        return getFieldSummary(value)
      })}
      {onConfirm && <button onClick={onConfirm}>Confirm</button>}
    </>
  )
}
