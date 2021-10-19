import { ChainId, Token, Amount } from '@carrot-kpi/sdk'
import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { RPC_URL } from '../../connectors'

export class TotalSupplyToken extends Token {
  private readonly totalSupplyGetterLogic: (token: Token) => Promise<Amount<Token>>

  constructor(
    chainId: ChainId,
    address: string,
    decimals: number,
    symbol: string,
    name: string,
    totalSupplyGetterLogic: (token: Token) => Promise<Amount<Token>>
  ) {
    super(chainId, address, decimals, symbol, name)
    this.totalSupplyGetterLogic = totalSupplyGetterLogic
  }

  public async totalSupply(): Promise<Amount<Token>> {
    return this.totalSupplyGetterLogic(this)
  }
}

const erc20Interface = new Interface(['function totalSupply() view returns (uint256)'])

// RInkeby testnet tokens
export const WEENUS = new Token(ChainId.RINKEBY, '0xaFF4481D10270F50f203E0763e2597776068CBc5', 18, 'WEENUS', 'Weenus')
export const XEENUS = new Token(ChainId.RINKEBY, '0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c', 18, 'XEENUS', 'Xeenus')
export const ZEENUS = new Token(ChainId.RINKEBY, '0x1f9061B953bBa0E36BF50F21876132DcF276fC6e', 18, 'ZEENUS', 'Zeenus')
export const WBTC = new TotalSupplyToken(
  ChainId.RINKEBY,
  '0x577D296678535e4903D59A4C929B718e1D575e0A',
  18,
  'WBTC',
  'Wrapped Bitcoin',
  async (token: Token) =>
    new Amount(
      token,
      await new Contract(token.address, erc20Interface, new JsonRpcProvider(RPC_URL[token.chainId])).totalSupply()
    )
)
export const WETH = new Token(
  ChainId.RINKEBY,
  '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  18,
  'WETH',
  'Wrapped Ether'
)

// xDai tokens
export const AGVE = new Token(ChainId.XDAI, '0x3a97704a1b25F08aa230ae53B352e2e72ef52843', 18, 'AGVE', 'Agave Token')

const MAINNET_STAKE_CONTRACT = new Contract(
  '0x0Ae055097C6d159879521C384F1D2123D1f195e6',
  erc20Interface,
  new JsonRpcProvider(RPC_URL[1])
)
export const STAKE = new TotalSupplyToken(
  ChainId.XDAI,
  '0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e',
  18,
  'STAKE',
  'STAKE on xDai',
  async (token: Token) => new Amount(token, await MAINNET_STAKE_CONTRACT.totalSupply())
)
