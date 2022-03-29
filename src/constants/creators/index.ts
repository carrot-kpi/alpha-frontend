import dxdaoLogo from '../../assets/svgs/dxdao-logo.svg'
import agaveLogo from '../../assets/svgs/agave-logo.svg'
import hundredFinanceLogo from '../../assets/svgs/hundred-finance-logo.svg'
import mochiLogo from '../../assets/mochi-logo.png'
import hoprLogo from '../../assets/hopr-logo.png'
import dappNodeLogo from '../../assets/dappnode-logo.webp'
import cowLogo from '../../assets/cow.png'

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

export const HOPR: Creator = {
  name: 'Hopr',
  logo: hoprLogo,
}

export const DAPPNODE: Creator = {
  name: 'DAppNode',
  logo: dappNodeLogo,
}

export const HUNDRED_FINANCE: Creator = {
  name: 'Hundred finance',
  logo: hundredFinanceLogo,
}

export const COW: Creator = {
  name: 'COW protocol',
  logo: cowLogo,
}
