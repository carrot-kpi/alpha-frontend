import { Template } from '@carrot-kpi/v1-sdk'
import { useCallback, useState } from 'react'
import { OraclesPickerStep } from '../../types'
import { DataFiller } from './data-filler'
import { TemplatesPicker } from './templates-picker'

interface OraclesPickerProps {
  spec: OraclesPickerStep
  onNext?: () => void
}

export const OraclesPicker = ({ spec, onNext }: OraclesPickerProps) => {
  const [picking, setPicking] = useState(true)
  const [chosenTemplates, setChosenTemplates] = useState<Template[]>([])

  const handleTemplatesPickerChange = useCallback((templates: Template[]) => {
    setChosenTemplates(templates)
    setPicking(false)
  }, [])

  return (
    <>
      {spec.description && (
        <>
          {spec.description}
          <br />
        </>
      )}
      {picking && (
        <TemplatesPicker min={spec.minimumOracles} max={spec.maximumOracles} onChange={handleTemplatesPickerChange} />
      )}
      {!picking && (
        <DataFiller
          chosenTemplates={chosenTemplates}
          additionalPerOracleFields={spec.additionalPerOracleFields}
          onNext={onNext}
        />
      )}
    </>
  )
}
