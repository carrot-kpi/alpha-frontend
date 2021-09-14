import { useMedia } from 'react-use'

export const useIsMobile = () => {
  return useMedia(`(max-width: 576px)`)
}
