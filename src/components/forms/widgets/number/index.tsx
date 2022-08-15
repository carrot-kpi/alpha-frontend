import { useCallback } from 'react'
import { NumberFormField } from '../../types'

interface NumberFormWidgetProps {
  spec: NumberFormField
  value: string
  onChange: (newState: any) => void
}

export const NumberFormWidget = ({ spec, value, onChange }: NumberFormWidgetProps) => {
  const handleLocalChange = useCallback(
    (event: any) => {
      onChange({ spec, internalState: event.target.value })
    },
    [onChange, spec]
  )

  return (
    <>
      {!!spec.label && <label htmlFor={spec.id}>{spec.label}: </label>}
      <input
        id={spec.id}
        type="number"
        value={value}
        onChange={handleLocalChange}
        placeholder={spec.placeholder}
        min={spec.min}
        max={spec.max}
        step={spec.step}
        readOnly={spec.readonly}
        required={spec.required}
      />
    </>
  )
}
