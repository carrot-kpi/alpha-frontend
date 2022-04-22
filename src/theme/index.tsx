import { createGlobalStyle } from 'styled-components'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import '@fontsource/overpass-mono/400.css'
import 'react-toastify/dist/ReactToastify.css'
import 'rc-switch/assets/index.css'
import 'rc-pagination/assets/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { transparentize } from 'polished'
import { lightTheme } from './light'
import { darkTheme } from './dark'

export interface Theme {
  background: string
  border: string
  overlay: string
  content: string
  contentSecondary: string

  surface: string
  surfaceContent: string
  surfaceContentSecondary: string
  surfaceIcon: string
  surfaceUnder: string
  surfaceOpened: string
  surfaceSelected: string
  surfaceHighlight: string
  surfacePressed: string
  surfaceInteractive: string

  feedbackSurface: string
  feedbackSurfaceContent: string
  feedbackSurfaceContentSecondary: string

  warning: string
  warningSurface: string
  warningSurfaceContent: string

  info: string
  infoSurface: string
  infoSurfaceContent: string

  help: string
  helpContent: string
  helpSurface: string
  helpSurfaceContent: string

  negative: string
  negativeContent: string
  negativeSurface: string
  negativeSurfaceContent: string

  positive: string
  positiveContent: string
  positiveSurface: string
  positiveSurfaceContent: string

  badge: string
  badgeContent: string
  badgePressed: string

  tagIdentifier: string
  tagIdentifierContent: string

  tagNew: string
  tagNewContent: string

  tagIndicator: string
  tagIndicatorContent: string

  tagActivity: string
  tagActivityContent: string

  hint: string
  link: string
  focus: string
  selected: string
  selectedContent: string
  selectedDisabled: string

  disabled: string
  disabledContent: string
  disabledIcon: string

  control: string
  controlBorder: string
  controlBorderPressed: string
  controlDisabled: string
  controlSurface: string
  controlUnder: string

  accent: string
  accentStart: string
  accentEnd: string
  accentContent: string

  floating: string
  floatingContent: string

  green: string
  yellow: string
  red: string
  blue: string
  brown: string
  purple: string

  twitter: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getTheme(darkMode: boolean): Theme {
  return darkMode ? darkTheme : lightTheme
}

export const GlobalStyle = createGlobalStyle`
  html, input, textarea, button {
    font-family: 'Manrope';
    font-weight: 500;
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
    color: ${(props) => props.theme.surfaceContent};
    transition: background-color .2s ease, color .2s ease;
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
      box-shadow: 0px 16px 12px ${({ theme }) => transparentize(0.8, theme.overlay)};
      border-radius: 12px !important;
  }

  .custom-toast-body {
      font-family: "Manrope";
  }

  .Toastify__toast {
      min-height: auto !important;
      padding: 16px;
  }

  .Toastify__progress-bar--info {
      background-color: ${(props) => props.theme.accent};
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
      background-color: ${(props) => props.theme.surface} !important;
      border: solid 1px ${(props) => props.theme.border};
      transition: background-color 0.2s ease, border .2s ease;
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

  .rc-switch:focus {
    box-shadow: none !important;
  }
  
  .rc-switch {
    background-color: ${(props) => props.theme.disabledContent} !important;
    border: solid 1px ${(props) => props.theme.disabledContent} !important;
  }

  .rc-switch.rc-switch-checked {
    border: 1px solid ${(props) => props.theme.positive} !important;
    background-color: ${(props) => props.theme.positive} !important;
  }

  .carrot-pagination {
    list-style: none;
    padding: 0;
  }

  .carrot-pagination ul {
    display: inline-flex;
  }

  .carrot-pagination li {
    display: inline-block;
    min-width: 28px;
    height: 22px;
    margin-right: 8px;
    vertical-align: middle;
    list-style: none;
    outline: 0;
    cursor: pointer;
    user-select: none;
    border: solid 1px ${(props) => props.theme.accent};
    transition: border 0.3s ease, color 0.3s ease;
    font-size: 14px;
    border-radius: 4px;
    text-align: center;
    line-height: 20px;
    color: ${(props) => props.theme.accent};

  }
  .carrot-pagination li:last-child {
    margin-right: 0;
  }

  .carrot-pagination li.rc-pagination-item-active {
    border: solid 1px ${(props) => props.theme.accent};
  }

  .carrot-pagination li.rc-pagination-prev,
  .carrot-pagination li.rc-pagination-next {
    transition: border 0.3s ease;
    color: ${(props) => props.theme.accent};
    padding-top: 2px;
  }

  .carrot-pagination li.rc-pagination-options {
    display: none;
  }

  .carrot-pagination li.rc-pagination-disabled {
    border: solid 1px ${(props) => props.theme.border};
    color: ${(props) => props.theme.border};
    cursor: not-allowed;
  }

  .carrot-pagination .rc-pagination-simple-pager {
    border: none;
  }

`

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
