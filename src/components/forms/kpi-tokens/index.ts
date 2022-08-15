import { FormStepGetter, KpiTokenInitializationDataGetter } from '../types'
import { schema as erc20V100Schema } from './erc20'
import { calldataGetter as erc20V100CalldataGetter } from './erc20'

export const kpiTokenForms: { [key: string]: FormStepGetter[] } = {
  '1-1': erc20V100Schema,
}

export const calldataGetters: { [key: string]: KpiTokenInitializationDataGetter } = {
  '1-1': erc20V100CalldataGetter,
}