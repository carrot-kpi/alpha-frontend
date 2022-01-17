import dxdaoLogo from '../../assets/svgs/dxdao-logo.svg'
import agaveLogo from '../../assets/svgs/agave-logo.svg'
import mochiLogo from '../../assets/mochi-logo.png'

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

export const MOCHI: Creator = {
  name: 'Mochi',
  logo: mochiLogo,
}
