import { defaultAbiCoder } from '@ethersproject/abi'
import { OracleInitializationDataGetter, FormStepGetter } from '../../types'

export const schema: FormStepGetter[] = [
  () => {
    return {
      type: 'form-schema',
      id: 'data',
      label: 'Reality.eth oracle',
      fields: [
        {
          type: 'hidden',
          id: 'realityInstanceAddress',
          required: true,
          value: '0xDf33060F476F8cff7511F806C72719394da1Ad64',
        },
        {
          type: 'select',
          id: 'arbitrator',
          description: 'The arbitrator for the question.',
          default: '0x29f39de98d750eb77b5fafb31b2837f079fce222',
          options: [
            {
              label: 'Kleros',
              value: '0x29f39de98d750eb77b5fafb31b2837f079fce222',
            },
            {
              label: 'No arbitrator',
              value: '0xe78996a233895be74a66f451f1019ca9734205cc',
            },
          ],
          label: 'Arbitrator',
          required: true,
        },
        {
          type: 'select',
          id: 'templateId',
          default: '0',
          options: [
            {
              label: 'Binary (yes/no answer)',
              value: '0',
            },
            {
              label: 'Range',
              value: '1',
            },
          ],
          label: 'Question type',
          required: true,
        },
        {
          type: 'string',
          id: 'questionText',
          label: 'Question',
          required: true,
        },
        {
          type: 'number',
          id: 'timeout',
          label: 'Timeout',
          min: 0,
          max: 604800,
          required: true,
        },
        {
          type: 'number',
          id: 'openingTimestamp',
          label: 'Opening time',
          min: 0,
          required: true,
        },
        {
          type: 'number',
          id: 'minimumBond',
          label: 'Minimum bond',
          min: 0,
          required: true,
        },
      ],
    }
  },
]

export const calldataGetter: OracleInitializationDataGetter = (state: any) => {
  return defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'string', 'uint32', 'uint32', 'uint256'],
    [
      state.realityInstanceAddress.internalState,
      state.arbitrator.internalState,
      state.templateId.internalState,
      state.questionText.internalState,
      state.timeout.internalState,
      state.openingTimestamp.internalState,
      state.minimumBond.internalState,
    ]
  )
}
