import dxdaoLogo from '../../assets/svgs/dxdao-logo.svg'

export interface Creator {
  name: string
  logo: string
  link: string
}

export const DXDAO: Creator = {
  name: 'DXdao',
  logo: dxdaoLogo,
  link: 'https://dxdao.eth.link',
}
