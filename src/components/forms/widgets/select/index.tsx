import { useCallback } from 'react'
import { SelectFormField } from '../../types'

interface SelectFormWidgetProps {
  spec: SelectFormField
  value: string
  onChange: (newState: any) => void
}

export const SelectFormWidget = ({ spec, value, onChange }: SelectFormWidgetProps) => {
  const handleLocalChange = useCallback(
    (event: any) => {
      onChange({ spec, internalState: event.target.value })
    },
    [onChange, spec]
  )

  return (
    <>
      {!!spec.label && <label htmlFor={spec.id}>{spec.label}: </label>}
      <select id={spec.id} value={value} onChange={handleLocalChange} required={spec.required}>
        {spec.options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        })}
      </select>
    </>
  )
}
