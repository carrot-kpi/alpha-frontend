import { Template } from '@carrot-kpi/v1-sdk'
import { useCallback, useContext, useEffect } from 'react'
import { CreationFormContext } from '../../../../../contexts/creation-form-context'
import { AutoForm } from '../../../auto-form'
import { calldataGetters, oracleForms } from '../../../oracles'
import { FormField } from '../../../types'

interface TemplatesPickerProps {
  chosenTemplates: Template[]
  additionalPerOracleFields?: (overallState: any, oracleState: any) => FormField[]
  onNext?: () => void
}

export const DataFiller = ({ chosenTemplates, additionalPerOracleFields, onNext }: TemplatesPickerProps) => {
  const { state, updateState } = useContext(CreationFormContext)
  
  useEffect(() => {
    if (state.oracles.internalState.length !== 0) return
    chosenTemplates.map((chosenTemplate) => {
      // initialize oracles state depending on how many were chosen
      state.oracles.internalState.push({
        __chosenTemplate: chosenTemplate,
        internalState: {},
      })
    })
    updateState({ ...state })
  }, [chosenTemplates, state, state.oracles, updateState])

  const handleFormChange = useCallback(
    (index: number) => (oracleFormState: any) => {
      state.oracles.internalState[index] = { ...state.oracles.internalState[index], internalState: oracleFormState }
      updateState({ ...state })
    },
    [state, updateState]
  )

  const handleNextClick = useCallback(() => {
    const oraclesInitializationData = chosenTemplates.map((template, index) => {
      const calldataGetter = calldataGetters[`${template.id}-${template.version.toString()}`]
      return calldataGetter(state.oracles.internalState[index].internalState)
    })
    for (let i = 0; i < oraclesInitializationData.length; i++) {
      state.oracles.internalState[i].initializationData = oraclesInitializationData[i]
    }
    updateState({ ...state })
    if (onNext) onNext()
  }, [chosenTemplates, onNext, state, updateState])

  return (
    <>
      {chosenTemplates.map((template, index) => {
        const stepGetter = oracleForms[`${template.id}-${template.version.toString()}`]
        if (!state.oracles || state.oracles.length === 0) return null
        const oracleState = state.oracles.internalState[index]
        if (!oracleState) return null
        const additionalOracleFields =
          !!additionalPerOracleFields && Object.keys(oracleState.internalState).length > 0
            ? additionalPerOracleFields(state, oracleState)
            : []
        return (
          <AutoForm
            key={index}
            formStepsGetter={stepGetter}
            additionalFields={additionalOracleFields}
            onChange={handleFormChange(index)}
          />
        )
      })}
      <button onClick={handleNextClick}>Next</button>
    </>
  )
}
