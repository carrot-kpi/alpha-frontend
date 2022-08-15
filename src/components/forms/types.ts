import { BigNumber } from '@ethersproject/bignumber'

export type BaseFormField = {
  type: string
  id: string
  required: boolean
  help?: string
}

export interface StringFormField extends BaseFormField {
  type: 'string'
  default?: string
  label?: string
  description?: string
  placeholder?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  readonly?: boolean
}

export interface NumberFormField extends BaseFormField {
  type: 'number'
  default?: number
  label?: string
  description?: string
  placeholder?: string
  multiplier?: number
  max?: number
  min?: number
  step?: number
  readonly?: boolean
}

export interface SelectFormField extends BaseFormField {
  type: 'select'
  default?: string
  label?: string
  description?: string
  options: { label: string; value: string }[]
}

export interface HiddenFormField {
  type: 'hidden'
  id: string
  value: string
}

export interface ERC20TokenAmountFormField extends BaseFormField {
  type: 'erc20-token-amount'
  default?: { address: string; amount: string }
  label?: string
  description?: string
}

export type FormField =
  | StringFormField
  | NumberFormField
  | SelectFormField
  | HiddenFormField
  | ERC20TokenAmountFormField

export interface BaseDedicatedStep {
  type: string
}

export interface OraclesPickerStep extends BaseDedicatedStep {
  type: 'oracles-picker'
  description?: string
  minimumOracles: number
  maximumOracles: number
  additionalPerOracleFields?: (overallState: any, oracleState: any) => FormField[]
}

export interface SummaryStep extends BaseDedicatedStep {
  type: 'summary'
  description?: string
}

export interface DescriptionStep extends BaseDedicatedStep {
  type: 'description'
  description?: string
}

type BaseOnchainSetupAction = {
  type: string
  label: string
}

// AUtomatically approve the given token amount to be used by the created KPI token
interface ERC20ApprovalOnchainSetupAction extends BaseOnchainSetupAction {
  type: 'erc20-approval'
  token: string
  amount: BigNumber
}

export type OnchainSetupAction = ERC20ApprovalOnchainSetupAction

export interface OnchainSetupStep extends BaseDedicatedStep {
  type: 'onchain-setup'
  description?: string
  actions: (state: any) => OnchainSetupAction[]
}

export type DedicatedStepDefinition = OraclesPickerStep | SummaryStep | DescriptionStep | OnchainSetupStep

export type DedicatedStep = {
  type: 'dedicated-step'
  id: string
  label: string
  definition: DedicatedStepDefinition
}

export type FormSchema = {
  type: 'form-schema'
  id: string
  label: string
  fields: FormField[]
}

export type FormStep = FormSchema | DedicatedStep

export type FormStepGetter = (state: any) => FormStep

export type OracleInitializationDataGetter = (state: any) => string
export type KpiTokenInitializationDataGetter = (state: any) => { kpiTokenData: string; oraclesData: string }
