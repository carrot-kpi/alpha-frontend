import { useCallback, useEffect, useMemo, useState } from 'react'
import { CreationFormContextProvider } from '../../../contexts/creation-form-context'
import { AutoFormStep } from '../auto-form/step'
import {
  FormStepGetter,
  FormStep,
  FormField,
  DedicatedStepDefinition,
  KpiTokenInitializationDataGetter,
} from '../types'

type FormFieldState = { spec: FormField; internalState: any }
type DedicatedStepState = { spec: DedicatedStepDefinition; internalState: any }
type FormState = { [fieldId: string]: FormFieldState | DedicatedStepState }

interface AutoFormProps {
  formStepsGetter: FormStepGetter[]
  initializationDataGetter?: KpiTokenInitializationDataGetter
  initialState?: any
  additionalFields?: FormField[]
  onChange?: (newState: any) => void
}

export const AutoForm = ({
  formStepsGetter,
  initializationDataGetter,
  initialState,
  additionalFields,
  onChange,
}: AutoFormProps) => {
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState<FormStep | undefined>()
  const properInitialState = useMemo(() => initialState || {}, [initialState])
  const [state, setState] = useState<FormState>(properInitialState)

  useEffect(() => {
    if (formStepsGetter.length === 0) return
    const step = formStepsGetter[index](state)
    setStep(step)
  }, [formStepsGetter, index, state])

  const handleStateUpdate = useCallback(
    (value: any) => {
      setState(value)
      if (onChange) onChange(value)
    },
    [onChange]
  )

  const handleNext = useCallback(() => {
    setIndex(index + 1)
  }, [index])

  return (
    <CreationFormContextProvider
      value={{
        state,
        updateState: handleStateUpdate,
      }}
    >
      <AutoFormStep
        step={step}
        initializationDataGetter={initializationDataGetter}
        additionalFields={additionalFields}
        onNext={index < formStepsGetter.length - 1 ? handleNext : undefined}
      />
    </CreationFormContextProvider>
  )
}
