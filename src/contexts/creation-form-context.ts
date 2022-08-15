import { createContext } from 'react'

export const CreationFormContext = createContext<{
  state: any
  updateState: (newState: any) => void
}>({ state: {} as any, updateState: (newState: any) => {} })
export const CreationFormContextProvider = CreationFormContext.Provider
