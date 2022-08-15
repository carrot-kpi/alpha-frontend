import { useCallback } from 'react'
import { AutoForm } from '../../auto-form'
import { DescriptionStep, FormStepGetter } from '../../types'

const DESCRIPTION_FORM_SCHEMA: FormStepGetter[] = [
  (state: any) => ({
    type: 'form-schema',
    id: 'description',
    label: 'Description',
    fields: [
      {
        type: 'string',
        id: 'title',
        description:
          "The title of the created ERC20 KPI token (this will be displayed in the KPI token's page). What is the KPI token about?",
        label: 'Title',
        required: true,
      },
      {
        type: 'string',
        id: 'description',
        description: 'A description of the created ERC20 KPI token.',
        label: 'Description',
        required: true,
      },
    ],
  }),
]

interface SummaryProps {
  spec: DescriptionStep
  onChange: (newState: any) => void
  onNext?: (newState: any) => void
}

export const Description = ({ spec, onChange, onNext }: SummaryProps) => {
  const handleLocalChange = useCallback(
    (newState: any) => {
      onChange({ spec, internalState: newState })
    },
    [onChange, spec]
  )

  return (
    <>
      <AutoForm formStepsGetter={DESCRIPTION_FORM_SCHEMA} onChange={handleLocalChange} />
      {onNext && <button onClick={onNext}>Next</button>}
    </>
  )
}
