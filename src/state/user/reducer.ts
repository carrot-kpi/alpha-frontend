import { createReducer } from '@reduxjs/toolkit'
import { updateDarkMode } from './actions'

export interface UserState {
  darkMode: boolean
}

export const initialState: UserState = {
  darkMode: true,
}

export const userReducer = createReducer(initialState, (builder) =>
  builder.addCase(updateDarkMode, (state, action) => {
    state.darkMode = action.payload
  })
)
