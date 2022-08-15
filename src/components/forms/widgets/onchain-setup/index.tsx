import { useCallback, useContext, useEffect, useState } from 'react'
import { KpiTokenInitializationDataGetter, OnchainSetupStep } from '../../types'
import { FACTORY_ABI, FACTORY_ADDRESS, KPI_TOKENS_MANAGER_ABI, KPI_TOKENS_MANAGER_ADDRESS } from '@carrot-kpi/v1-sdk'
import { useActiveWeb3React } from '../../../../hooks/useActiveWeb3React'
import { CreationFormContext } from '../../../../contexts/creation-form-context'
import { CID } from 'multiformats/cid'
import { encode as encodeIpfsJson } from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import { TransactionRequest } from '@ethersproject/providers'
import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'

const ERC20_INTERFACE = new Interface([
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
])
const FACTORY_INTERFACE = new Interface(FACTORY_ABI)
const KPI_TOKENS_MANAGER_INTERFACE = new Interface(KPI_TOKENS_MANAGER_ABI)

interface OnchainSetupProps {
  spec: OnchainSetupStep
  initializationDataGetter: KpiTokenInitializationDataGetter
}

export const OnchainSetup = ({ spec, initializationDataGetter }: OnchainSetupProps) => {
  const { chainId, account, library } = useActiveWeb3React()
  const { state } = useContext(CreationFormContext)

  const [setupTransactions, setSetupTransactions] = useState<(TransactionRequest & { label: string })[]>([])

  useEffect(() => {
    let cancelled = false
    async function setData() {
      if (!state || Object.keys(state).length === 0 || !chainId || !account) return
      const { kpiTokenData, oraclesData } = initializationDataGetter(state)

      const encodedJson = encodeIpfsJson({
        title: state.title,
        description: state.description,
        tags: state.tags,
        widgets: state.widgets,
      })
      const hash = await sha256.digest(encodedJson)
      const cid = CID.createV0(hash).toV1().toString()
      const kpiTokensManager = new Contract(KPI_TOKENS_MANAGER_ADDRESS[chainId], KPI_TOKENS_MANAGER_INTERFACE, library)
      const tokenAddress = await kpiTokensManager.predictInstanceAddress(
        account,
        state.__chosenTemplate.id,
        cid,
        kpiTokenData,
        oraclesData
      )
      const actions = spec.actions(state)
      const setupTransactions = actions.map((action): TransactionRequest & { label: string } => {
        switch (action.type) {
          case 'erc20-approval': {
            return {
              label: action.label,
              to: action.token,
              data: ERC20_INTERFACE.encodeFunctionData('approve(address,uint256)', [tokenAddress, action.amount]),
            }
          }
        }
      })
      const encodedData = FACTORY_INTERFACE.encodeFunctionData('createToken(uint256,string,uint256,bytes,bytes)', [
        state.__chosenTemplate.id,
        cid,
        Math.floor(Date.now() / 1000) + 10000, // TODO: this must be a user input
        kpiTokenData,
        oraclesData,
      ])
      if (!cancelled)
        setSetupTransactions([
          ...setupTransactions,
          {
            label: 'Create KPI token',
            to: FACTORY_ADDRESS[chainId],
            data: encodedData,
          },
        ])
    }
    setData()
    return () => {
      cancelled = true
    }
  }, [account, chainId, initializationDataGetter, library, spec, state])

  const handleClick = useCallback(
    (setupTransaction: TransactionRequest) => () => {
      if (!library) return
      library.send('eth_sendTransaction', [{ from: account, to: setupTransaction.to, data: setupTransaction.data }])
    },
    [account, library]
  )

  return (
    <>
      {setupTransactions.map((setupTransaction, index) => {
        return (
          <>
            <button key={index} onClick={handleClick(setupTransaction)}>
              {setupTransaction.label}
            </button>
            <br />
          </>
        )
      })}
    </>
  )
}
