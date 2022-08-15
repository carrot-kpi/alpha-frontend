import { defaultAbiCoder } from '@ethersproject/abi'
import { FormField, FormStepGetter, KpiTokenInitializationDataGetter, OnchainSetupAction } from '../../types'

export const schema: FormStepGetter[] = [
  () => ({
    type: 'form-schema',
    id: 'base-data',
    label: 'Base data',
    fields: [
      {
        type: 'string',
        id: 'name',
        description: 'The name of the created ERC20 KPI token.',
        label: 'Name',
        required: true,
      },
      {
        type: 'string',
        id: 'symbol',
        description: 'The symbol (ticker) of the created ERC20 KPI token.',
        label: 'Symbol',
        required: true,
      },
      {
        type: 'number',
        id: 'totalSupply',
        min: 0,
        multiplier: 18,
        description: 'The total supply of the created ERC20 KPI token.',
        label: 'Total supply',
        required: true,
      },
      {
        type: 'erc20-token-amount',
        id: 'collateral',
        description: 'The total supply of the created ERC20 KPI token.',
        label: 'Collateral',
        required: true,
      },
    ],
  }),
  () => ({
    type: 'dedicated-step',
    id: 'oracles',
    label: 'Oracles',
    definition: {
      type: 'oracles-picker',
      description: 'Pick up to 5 oracles. Oracles are used to relay condition results on-chain.',
      minimumOracles: 1,
      maximumOracles: 5,
      additionalPerOracleFields: (overallState: any, oracleState: any) => {
        let fields: FormField[]
        if (oracleState.__chosenTemplate.id === 1 && oracleState.internalState.templateId.internalState === '0')
          fields = [
            {
              type: 'hidden',
              id: `lowerBound`,
              value: '0',
            },
            {
              type: 'hidden',
              id: `higherBound`,
              value: '1',
            },
          ]
        else
          fields = [
            {
              type: 'number',
              id: `lowerBound`,
              description: 'The lower bound for the oracle.',
              label: 'Lower bound',
              required: true,
            },
            {
              type: 'number',
              id: `higherBound`,
              description: 'The higher bound for the oracle.',
              label: 'Higher bound',
              required: true,
            },
          ]
        fields.push(
          overallState.oracles.internalState.length > 1
            ? {
                type: 'number',
                id: `weight`,
                description: 'The weight for the oracle.',
                label: 'Weight',
                required: true,
              }
            : {
                type: 'hidden',
                id: `weight`,
                value: '1',
              }
        )
        return fields
      },
    },
  }),
  () => ({
    type: 'dedicated-step',
    id: 'description',
    label: 'Description',
    definition: {
      type: 'description',
      description: 'Description',
    },
  }),
  () => ({
    type: 'dedicated-step',
    id: 'summary',
    label: 'Summary',
    definition: {
      type: 'summary',
      description: 'Summary of data pre creation',
    },
  }),
  () => ({
    type: 'dedicated-step',
    id: 'onchain-setup',
    label: 'Onchain setup',
    definition: {
      type: 'onchain-setup',
      description: 'Summary of data pre creation',
      actions: (state): OnchainSetupAction[] => [
        {
          type: 'erc20-approval',
          label: `Approve ${state.collateral.internalState.amount} ${state.collateral.internalState.address}`,
          token: state.collateral.internalState.address,
          amount: state.collateral.internalState.amount,
        },
      ],
    },
  }),
]

export const calldataGetter: KpiTokenInitializationDataGetter = (state: any) => {
  const kpiTokenData = defaultAbiCoder.encode(
    ['tuple(address,uint256,uint256)[]', 'string', 'string', 'uint256'],
    [
      [[state.collateral.internalState.address, state.collateral.internalState.amount, 0]],
      state.name.internalState,
      state.symbol.internalState,
      state.totalSupply.internalState,
    ]
  )
  const oraclesData = defaultAbiCoder.encode(
    ['tuple(uint256,uint256,uint256,uint256,uint256,bytes)[]', 'bool'],
    [
      state.oracles.internalState.map((oracleData: any) => {
        return [
          oracleData.__chosenTemplate.id,
          oracleData.internalState.lowerBound.internalState,
          oracleData.internalState.higherBound.internalState,
          oracleData.internalState.weight.internalState,
          oracleData.internalState.minimumBond.internalState,
          oracleData.initializationData,
        ]
      }),
      false,
    ]
  )
  return { kpiTokenData, oraclesData }
}
