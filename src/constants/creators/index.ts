import dxdaoLogo from '../../assets/svgs/dxdao-logo.svg'
import agaveLogo from '../../assets/svgs/agave-logo.svg'

export interface Creator {
  name: string
  logo: string
}

export const DXDAO: Creator = {
  name: 'DXdao',
  logo: dxdaoLogo,
}

export const AGAVE: Creator = {
  name: 'Agave',
  logo: agaveLogo,
}
