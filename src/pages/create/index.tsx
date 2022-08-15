import { Template } from '@carrot-kpi/v1-sdk'
import { useCallback, useState } from 'react'
import { AutoForm } from '../../components/forms/auto-form'
import { kpiTokenForms, calldataGetters } from '../../components/forms/kpi-tokens'
import { useKpiTokenTemplates } from '../../hooks/useKpiTokenTemplates'

export const Create = () => {
  const { loading, templates } = useKpiTokenTemplates()

  const [chosenTemplate, setChosenTemplate] = useState<Template | null>(null)

  const handleUse = useCallback(
    (template: Template) => () => {
      setChosenTemplate(template)
    },
    []
  )

  if (chosenTemplate)
    return (
      <AutoForm
        formStepsGetter={kpiTokenForms[`${chosenTemplate.id}-${chosenTemplate.version.toString()}`]}
        initializationDataGetter={calldataGetters[`${chosenTemplate.id}-${chosenTemplate.version.toString()}`]}
        initialState={{ __chosenTemplate: chosenTemplate }}
      />
    )
  return (
    <>
      {loading && <>Loading...</>}
      {!loading && templates.length > 0 && (
        <ul>
          {templates.map((template) => (
            <>
              <ul key={template.address}>
                <li>Title: {template.specification.name}</li>
                <li>Version: {template.version.toString()}</li>
                <li>ID: {template.id.toString()}</li>
                <li>Description: {template.specification.description}</li>
              </ul>
              <button key={template.address + '-button'} onClick={handleUse(template)}>
                Use
              </button>
            </>
          ))}
        </ul>
      )}
      {!loading && templates.length === 0 && <>No KPI token templates</>}
    </>
  )
}
