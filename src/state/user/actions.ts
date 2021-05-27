import { createAction } from '@reduxjs/toolkit'

export const updateDarkMode = createAction<boolean>('user/updateUserDarkMode')
