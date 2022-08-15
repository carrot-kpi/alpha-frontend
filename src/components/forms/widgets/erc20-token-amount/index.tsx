import { useCallback, useContext } from 'react'
import { CreationFormContext } from '../../../../contexts/creation-form-context'
import { ERC20TokenAmountFormField } from '../../types'

interface ERC20TokenAmountFormWidgetProps {
  spec: ERC20TokenAmountFormField
  value: { address: string; amount: string }
  onChange: (newState: any) => void
}

export const ERC20TokenAmountFormWidget = ({ spec, value, onChange }: ERC20TokenAmountFormWidgetProps) => {
  const { state } = useContext(CreationFormContext)

  const handleLocalAddressChange = useCallback(
    (event: any) => {
      onChange({ spec, internalState: { address: event.target.value, amount: state[spec.id].internalState.amount } })
    },
    [onChange, spec, state]
  )

  const handleLocalAmountChange = useCallback(
    (event: any) => {
      onChange({ spec, internalState: { address: state[spec.id].internalState.address, amount: event.target.value.toString() } })
    },
    [onChange, spec, state]
  )

  return (
    <>
      {!!spec.label && <label htmlFor={spec.id}>{spec.label}: </label>}
      <br />
      <input
        id={`${spec.id}-1`}
        type="string"
        placeholder="Address"
        value={value.address}
        onChange={handleLocalAddressChange}
        required={spec.required}
      />
      <br />
      <input
        id={`${spec.id}-2`}
        type="number"
        placeholder="Amount"
        value={value.amount}
        onChange={handleLocalAmountChange}
        required={spec.required}
      />
    </>
  )
}
