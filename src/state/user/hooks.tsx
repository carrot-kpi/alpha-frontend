import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateDarkMode } from './actions'

export function useIsDarkMode(): boolean {
  return useSelector<AppState, boolean>((state) => state.user.darkMode)
}

export function useToggleDarkMode(): () => void {
  const dispatch = useDispatch<AppDispatch>()
  const darkMode = useIsDarkMode()

  return useCallback(() => {
    dispatch(updateDarkMode(!darkMode))
  }, [darkMode, dispatch])
}
