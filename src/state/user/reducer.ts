import { createReducer } from '@reduxjs/toolkit'
import { toggleDarkMode } from './actions'

export interface ApplicationState {
  readonly darkMode: boolean
}

const initialState: ApplicationState = {
  darkMode: false,
}

export const userReducer = createReducer(initialState, (builder) =>
  builder.addCase(toggleDarkMode, (state) => {
    state.darkMode = !state.darkMode
  })
)
