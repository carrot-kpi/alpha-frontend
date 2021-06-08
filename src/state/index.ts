import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import { userReducer } from './user/reducer'

const PERSISTED_KEYS: string[] = ['user']

const persistenceNamespace = 'carrot'
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS, namespace: persistenceNamespace }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS, namespace: persistenceNamespace }),
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
