import { createGlobalStyle } from 'styled-components'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import 'react-toastify/dist/ReactToastify.css'
import { transparentize } from 'polished'

const white = '#fff'
const black = '#000'

export interface Theme {
  white: string
  black: string
  text: string
  background: string
  divider: string
  primary: string
  shadow: string
  error: string
  success: string
  warning: string
  skeletonColor: string
  skeletonHighlightColor: string
  boxShadow: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getTheme(darkMode: boolean): Theme {
  return {
    white,
    black,
    text: darkMode ? white : black,
    background: darkMode ? black : white,
    divider: darkMode ? '#404040' : '#cccccc',
    primary: '#FF782D',
    shadow: darkMode ? '#fff' : '#000',
    error: '#c62828',
    success: '#008035',
    warning: '#FF6F00',
    skeletonColor: darkMode ? '#1a1a1a' : '#f2f2f2',
    skeletonHighlightColor: darkMode ? '#404040' : '#d9d9d9',
    boxShadow: '#0A0A0F',
  }
}

export const GlobalStyle = createGlobalStyle`
  html, input, textarea, button {
    font-family: 'Inter';
  }

  html,
  body {
    margin: 0;
    padding: 0;
    max-width: 100vw;
    height: 100vh;
    min-height: 100vh;
    overflow-x: hidden;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
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
      font-family: "Inter";
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
