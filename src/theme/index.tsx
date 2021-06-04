import { createGlobalStyle } from 'styled-components'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/ubuntu-mono/400.css'
import 'react-toastify/dist/ReactToastify.css'
import { transparentize } from 'polished'

const white = '#fff'
const black = '#000'

export interface Theme {
  white: string
  black: string
  divider: string
  primary: string
  shadow: string
  error: string
  success: string
  warning: string
  grey1: string
  grey2: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getTheme(darkMode: boolean): Theme {
  return {
    white,
    black,
    divider: '#e6e6e6',
    primary: '#FF782D',
    shadow: '#000',
    error: '#c62828',
    success: '#008035',
    warning: '#FF6F00',
    grey1: '#f2f2f2',
    grey2: '#d9d9d9',
  }
}

export const GlobalStyle = createGlobalStyle`
  html, input, textarea, button {
    font-family: 'Montserrat';
  }

  html,
  body {
    margin: 0;
    padding: 0;
    max-width: 100vw;
    height: 100vh;
    min-height: 100vh;
    overflow-x: hidden;
  }

  #root {
    height: 100vh;
    min-height: 100vh;
  }

  .custom-toast-root {
      margin-top: 76px !important;
      width: auto !important;
  }

  @media (max-width: 600px) {
      .custom-toast-root {
          left: 16px !important;
          right: 16px !important;
      }
  }

  .custom-toast-container {
      box-shadow: 0px 30px 62px 0px ${(props) => transparentize(0.9, props.theme.shadow)} !important;
      border-radius: 16px !important;
  }

  .custom-toast-body {
      font-family: "Montserrat";
      padding: 4px 8px;
  }

  .Toastify__toast {
      min-height: auto !important;
  }

  .Toastify__toast-body {
      margin: 0 !important;
  }

  .Toastify__toast--warning {
      background: ${(props) => props.theme.warning} !important;
  }
  
  .Toastify__toast--error {
      background: ${(props) => props.theme.error} !important;
  }
  
  .Toastify__toast--success {
      background: ${(props) => props.theme.success} !important;
  }
`

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
