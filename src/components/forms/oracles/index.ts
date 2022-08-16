import { OracleInitializationDataGetter, FormStepGetter } from '../types'
import { schema as manualRealityV100Schema, calldataGetter as manualRealityV100CalldataGetter } from './reality'

export const oracleForms: { [key: string]: FormStepGetter[] } = {
  '1-1': manualRealityV100Schema,
}

export const calldataGetters: { [key: string]: OracleInitializationDataGetter } = {
  '1-1': manualRealityV100CalldataGetter,
}
