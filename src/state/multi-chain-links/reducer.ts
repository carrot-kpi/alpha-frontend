import { createReducer } from '@reduxjs/toolkit'
import { updateSwitchingToCorrectChain } from './actions'

export interface MultiChainLinksState {
  readonly switchingToCorrectChain: boolean
}

const initialState: MultiChainLinksState = {
  switchingToCorrectChain: true,
}

export const multiChainLinksReducer = createReducer<MultiChainLinksState>(initialState, (builder) =>
  builder.addCase(updateSwitchingToCorrectChain, (state, { payload: switchingToCorrectChain }) => ({
    ...state,
    switchingToCorrectChain,
  }))
)
