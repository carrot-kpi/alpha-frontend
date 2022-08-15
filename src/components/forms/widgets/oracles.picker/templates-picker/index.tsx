import { Template } from '@carrot-kpi/v1-sdk'
import { useCallback, useState } from 'react'
import { useOracleTemplates } from '../../../../../hooks/useOracleTemplates'

interface TemplatesPickerProps {
  max: number
  min: number
  onChange: (chosenTemplates: Template[]) => void
}

export const TemplatesPicker = ({ min, max, onChange }: TemplatesPickerProps) => {
  const { loading, templates } = useOracleTemplates()

  const [chosenTemplates, setChosenTemplates] = useState<Template[]>([])

  const handleTemplateChoice = useCallback(
    (event: any) => {
      if (!templates || templates.length === 0) return
      const chosenTemplate = templates.find((template) => template.id.toString() === event.target.id)
      if (!!!chosenTemplate) return
      const currentCount = chosenTemplates.filter(
        (chosenTemplate) => chosenTemplate.id.toString() === event.target.id
      ).length
      const newValue = event.target.value
      const difference = newValue - currentCount
      if (difference === 1 && chosenTemplates.length < max) setChosenTemplates([...chosenTemplates, chosenTemplate])
      if (difference === -1) {
        const index = chosenTemplates.findIndex((template) => template.id.toString() === event.target.id)
        chosenTemplates.splice(index, 1)
        setChosenTemplates([...chosenTemplates])
      }
    },
    [chosenTemplates, max, templates]
  )

  const handleNext = useCallback(() => {
    onChange(chosenTemplates)
  }, [chosenTemplates, onChange])

  return (
    <>
      {loading && <>Loading...</>}
      {!loading && templates.length > 0 && (
        <ul>
          {templates.map((template) => (
            <>
              <ul key={template.id.toString()}>
                <li>Title: {template.specification.name}</li>
                <li>Version: {template.version.toString()}</li>
                <li>ID: {template.id.toString()}</li>
                <li>Description: {template.specification.description}</li>
                <li>
                  <input
                    type="number"
                    id={template.id.toString()}
                    min={0}
                    value={chosenTemplates.filter((chosenTemplate) => chosenTemplate.id === template.id).length}
                    onChange={handleTemplateChoice}
                  />
                  <label htmlFor={template.id.toString()}> Select</label>
                </li>
              </ul>
            </>
          ))}
          <button disabled={chosenTemplates.length < min} onClick={handleNext}>
            Next
          </button>
        </ul>
      )}
      {!loading && templates.length === 0 && <>No KPI token templates</>}
    </>
  )
}
