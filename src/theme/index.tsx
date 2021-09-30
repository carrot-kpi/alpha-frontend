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
      box-shadow: 0px 16px 12px ${({ theme }) => transparentize(0.8, theme.boxShadow)};
      border-radius: 12px !important;
  }

  .custom-toast-body {
      font-family: "Inter";
  }

  .Toastify__toast {
      min-height: auto !important;
      padding: 16px;
  }

  .Toastify__progress-bar--info {
    background-color: ${(props) => props.theme.primary};
  }

  .Toastify__toast-body {
      margin: 0 !important;
      padding: 0 !important;
  }

  .Toastify__close-button {
    position: absolute;
    right: 12px;
    top: 12px;
  }

  .Toastify__toast--info {
      background: ${(props) => props.theme.white} !important;
      border: solid 1px ${(props) => props.theme.divider};
  }
  
  .Toastify__toast-icon {
      display: none;
  }

  .Toastify__toast-container--top-right {
    right: 28px;
  }

  @media only screen and (max-width: 600px) {
    .Toastify__toast-container--top-right {
        top: auto !important;
        bottom: 70px !important;
        left: 12px !important;
        right: 12px !important;
    }
    
    .Toastify__toast-container {
        width: auto !important;
    }
  }
`

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
