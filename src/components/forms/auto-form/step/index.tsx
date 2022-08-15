import { useCallback, useContext, useEffect } from 'react'
import { CreationFormContext } from '../../../../contexts/creation-form-context'
import { FormField, FormStep, KpiTokenInitializationDataGetter } from '../../types'
import { Description } from '../../widgets/description'
import { ERC20TokenAmountFormWidget } from '../../widgets/erc20-token-amount'
import { HiddenFormWidget } from '../../widgets/hidden'
import { NumberFormWidget } from '../../widgets/number'
import { OnchainSetup } from '../../widgets/onchain-setup'
import { OraclesPicker } from '../../widgets/oracles.picker'
import { SelectFormWidget } from '../../widgets/select'
import { StringFormWidget } from '../../widgets/string'
import { Summary } from '../../widgets/summary'

const formFieldTypeToInitializationValue: { [type in FormField['type']]: any } = {
  string: '',
  number: 0,
  hidden: '',
  select: '',
  'erc20-token-amount': { address: '', amount: '' },
}

const getFormFieldDefaultValue = (field: FormField) => {
  switch (field.type) {
    case 'hidden':
      return field.value
    case 'number':
    case 'string':
      return field.default
    case 'select':
      return field.default
    case 'erc20-token-amount':
      return { address: '', amount: '' }
  }
}

const getFormInput = (field: FormField, state: any, updateState: (fieldId: string) => (newState: any) => void) => {
  if (!state[field.id]) return null
  switch (field.type) {
    case 'string':
      return (
        <StringFormWidget
          key={field.id}
          spec={field}
          value={state[field.id].internalState as any}
          onChange={updateState(field.id)}
        />
      )
    case 'number':
      return (
        <NumberFormWidget
          key={field.id}
          spec={field}
          value={state[field.id].internalState as any}
          onChange={updateState(field.id)}
        />
      )
    case 'hidden':
      return <HiddenFormWidget key={field.id} spec={field} />
    case 'select':
      return (
        <SelectFormWidget
          key={field.id}
          spec={field}
          value={state[field.id].internalState as any}
          onChange={updateState(field.id)}
        />
      )
    case 'erc20-token-amount':
      return (
        <ERC20TokenAmountFormWidget
          key={field.id}
          spec={field}
          value={state[field.id].internalState as any}
          onChange={updateState(field.id)}
        />
      )
  }
}

interface AutoFormStepProps {
  step?: FormStep
  initializationDataGetter?: KpiTokenInitializationDataGetter
  additionalFields?: FormField[]
  onNext?: () => void
}

export const AutoFormStep = ({ step, initializationDataGetter, additionalFields = [], onNext }: AutoFormStepProps) => {
  const { state, updateState } = useContext(CreationFormContext)

  useEffect(() => {
    if (!step) return
    if (step.type === 'dedicated-step') {
      if (!!state[step.id]) return // already initialized
      switch (step.definition.type) {
        case 'oracles-picker': {
          updateState({ ...state, [step.id]: { spec: step.definition, internalState: [] } })
          break
        }
        case 'description': {
          updateState({ ...state, [step.id]: { spec: step.definition, internalState: {} } })
          break
        }
        case 'onchain-setup': {
          updateState({ ...state, [step.id]: { spec: step.definition, internalState: {} } })
          break
        }
        case 'summary': {
          break
        }
      }
      return
    }
    const newState = step.fields.concat(additionalFields).reduce((newState: any, field) => {
      if (state[field.id] !== undefined) return newState
      const defaultValue = getFormFieldDefaultValue(field)
      newState[field.id] = {
        spec: field,
        internalState: defaultValue || formFieldTypeToInitializationValue[field.type],
      }
      return newState
    }, {})
    if (Object.keys(newState).length === 0) return
    updateState({
      ...state,
      ...newState,
    })
  }, [additionalFields, state, step, updateState])

  const handleStateUpdate = useCallback(
    (fieldId: string) => (value: any) => {
      updateState({ ...state, [fieldId]: value })
    },
    [state, updateState]
  )

  if (!step || Object.keys(state).length === 0) return null
  if (step.type === 'dedicated-step') {
    switch (step.definition.type) {
      case 'oracles-picker':
        return <OraclesPicker spec={step.definition} onNext={onNext} />
      case 'description':
        return <Description spec={step.definition} onChange={handleStateUpdate(step.id)} onNext={onNext} />
      case 'onchain-setup':
        return <OnchainSetup spec={step.definition} initializationDataGetter={initializationDataGetter!} />
      case 'summary':
        return <Summary spec={step.definition} state={state} onConfirm={onNext} />
    }
  }
  return (
    <>
      <p>{step.label}</p>
      {step.fields.concat(additionalFields).map((field) => {
        const formInput = getFormInput(field, state, handleStateUpdate)
        return (
          <>
            {formInput}
            {field.type !== 'hidden' && (
              <>
                <br />
                <br />
              </>
            )}
          </>
        )
      })}
      {/* TODO: disable button if the required data is not available in the state */}
      {!!onNext && <button onClick={onNext}>Next</button>}
    </>
  )
}
