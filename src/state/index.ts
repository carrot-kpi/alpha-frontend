import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import { applicationReducer } from './application/reducer'
import { userReducer } from './user/reducer'
import { transactionsReducer } from './transactions/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

const persistenceNamespace = 'carrot'
export const store = configureStore({
  reducer: {
    application: applicationReducer,
    user: userReducer,
    transactions: transactionsReducer,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS, namespace: persistenceNamespace }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS, namespace: persistenceNamespace }),
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
