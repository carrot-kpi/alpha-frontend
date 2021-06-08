import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '..'
import { toggleDarkMode } from './actions'

export const useIsDarkMode = (): boolean => {
  return useSelector<AppState, boolean>((state) => state.user.darkMode)
}

export const useToggleDarkMode = (): (() => void) => {
  const dispatch = useDispatch()

  return useCallback(() => {
    dispatch(toggleDarkMode())
  }, [dispatch])
}
