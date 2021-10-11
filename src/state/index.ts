import { configureStore } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import { userReducer } from './user/reducer'
import { multicallReducer } from './multicall/reducer'
import { transactionsReducer } from './transactions/reducer'
import { applicationReducer } from './application/reducer'
import { multiChainLinksReducer } from './multi-chain-links/reducer'

const PERSISTED_KEYS: string[] = ['user']

const persistenceNamespace = 'carrot'
export const store = configureStore({
  reducer: {
    application: applicationReducer,
    user: userReducer,
    multicall: multicallReducer,
    transactions: transactionsReducer,
    multiChainLinks: multiChainLinksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(save({ states: PERSISTED_KEYS, namespace: persistenceNamespace })),
  preloadedState: load({ states: PERSISTED_KEYS, namespace: persistenceNamespace }),
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
