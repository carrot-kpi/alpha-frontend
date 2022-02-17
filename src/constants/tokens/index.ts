import { ChainId, Token, Amount, KpiToken } from '@carrot-kpi/sdk'
import { Interface } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcProvider } from '@ethersproject/providers'
import { formatBytes32String } from '@ethersproject/strings'
import { RPC_URL } from '../../connectors'
import { DateTime } from 'luxon'
import { parseUnits } from '@ethersproject/units'

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

// Rinkeby testnet tokens
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

export const MAINNET_WETH = new Token(
  ChainId.MAINNET,
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  18,
  'WETH',
  'Wrapped Ether'
)

// Gnosis tokens
export const AGVE = new Token(ChainId.GNOSIS, '0x3a97704a1b25F08aa230ae53B352e2e72ef52843', 18, 'AGVE', 'Agave Token')

const MAINNET_STAKE_CONTRACT = new Contract(
  '0x0Ae055097C6d159879521C384F1D2123D1f195e6',
  erc20Interface,
  new JsonRpcProvider(RPC_URL[1])
)
export const STAKE = new TotalSupplyToken(
  ChainId.GNOSIS,
  '0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e',
  18,
  'STAKE',
  'STAKE from Ethereum',
  async (token: Token) => new Amount(token, await MAINNET_STAKE_CONTRACT.totalSupply())
)

export const DXD = new Token(
  ChainId.GNOSIS,
  '0xb90D6bec20993Be5d72A5ab353343f7a0281f158',
  18,
  'DXD',
  'DXdao from Ethereum'
)
export const GNOSIS_WETH = new Token(
  ChainId.GNOSIS,
  '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  18,
  'WETH',
  'Wrapped Ether from Ethereum'
)

export const SWPR = new Token(
  ChainId.GNOSIS,
  '0x532801ED6f82FFfD2DAB70A19fC2d7B2772C4f4b',
  18,
  'SWPR',
  'SWPR from Ethereum'
)

export const GNO = new Token(ChainId.GNOSIS, '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb', 18, 'GNO', 'GNO from Ethereum')

export const HOPR = new Token(
  ChainId.GNOSIS,
  '0xD057604A14982FE8D88c5fC25Aac3267eA142a08',
  18,
  'HOPR',
  'HOPR from Ethereum'
)

export const WXDAI = new Token(ChainId.GNOSIS, '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', 18, 'WXDAI', 'Wrapped XDAI')

export const GNOSIS_NODE = new Token(
  ChainId.GNOSIS,
  '0xc60e38C6352875c051B481Cbe79Dd0383AdB7817',
  18,
  'NODE',
  'DAppNode DAO token from Ethereum'
)

export const MAINNET_NODE = new Token(
  ChainId.MAINNET,
  '0xda007777d86ac6d989cc9f79a73261b3fc5e0da0',
  18,
  'NODE',
  'DAppNode DAO token'
)

// Mainnet tokens
export const USDM = new Token(ChainId.MAINNET, '0x31d4eb09a216e181ec8a43ce79226a487d6f0ba9', 18, 'USDM', 'USDM')
export const MOCHI = new Token(ChainId.MAINNET, '0x60ef10edff6d600cd91caeca04caed2a2e605fe5', 18, 'MOCHI', 'Mochi Inu')

// Test KPI tokens
export const MOCHI_TEST_KPI_TOKEN = new KpiToken(
  ChainId.MAINNET,
  AddressZero,
  'MTEST',
  'Mochi test',
  formatBytes32String('1234-test'),
  parseUnits('100000', 18),
  AddressZero,
  'Mochi test?',
  BigNumber.from(0),
  BigNumber.from(1),
  BigNumber.from(0),
  DateTime.fromSeconds(Math.floor(Date.now() / 1000) + 3600),
  false,
  false,
  AddressZero,
  new Amount<Token>(MOCHI, parseUnits('100000000', MOCHI.decimals)),
  new Amount<Token>(MOCHI, parseUnits('3000', MOCHI.decimals))
)

export const DAPPNODE_TEST_KPI_TOKEN_1 = new KpiToken(
  ChainId.GNOSIS,
  AddressZero,
  'xNODEWETHTVL-0413',
  'Swapr GC NODEWETH TVL 04-13',
  formatBytes32String('12345678-test'),
  parseUnits('100000', 18),
  AddressZero,
  `# What will the average TVL for the Swapr Gnosis Chain NODE-WETH pair be from 16th Feb to 13th April?
  
  ## Details
  This campaign will pay out in the range of 250K USD to 1M USD, with no payout when the result is below 250K USD and increasing linear payout over the range with a full collateral payout when the result is 1M USD or higher.
  
  ## Calculating the final answer
  The dedicated chart on the official carrot.eth frontend will show daily TVL of the pool in the specified date range. Each bar represents a TVL reading taken each day at 12:00 UTC. To calculate the final result, use the data for each bar and calculate the average between all the charted values.`,
  parseUnits('100000', 18),
  parseUnits('200000', 18),
  BigNumber.from(0),
  DateTime.fromSeconds(1649851200),
  false,
  false,
  AddressZero,
  new Amount<Token>(GNOSIS_NODE, parseUnits('100000', GNOSIS_NODE.decimals)),
  new Amount<Token>(GNOSIS_NODE, parseUnits('0', GNOSIS_NODE.decimals))
)

export const DAPPNODE_TEST_KPI_TOKEN_2 = new KpiToken(
  ChainId.MAINNET,
  AddressZero,
  'mNODEWETHTVL-0413',
  'Uniswap v2 mainnet NODEWETH TVL 04-13',
  formatBytes32String('123456789-test'),
  parseUnits('100000', 18),
  AddressZero,
  `# What will the average TVL for the Uniswap v2 mainnet NODE-WETH pair be from 16th Feb to 13th April?
  
  ## Details
  This campaign will pay out in the range of 250K USD to 1M USD, with no payout when the result is below 250K USD and increasing linear payout over the range with a full collateral payout when the result is 1M USD or higher.
  
  ## Calculating the final answer
  The dedicated chart on the official carrot.eth frontend will show daily TVL of the pool in the specified date range. Each bar represents a TVL reading taken each day at 12:00 UTC. To calculate the final result, use the data for each bar and calculate the average between all the charted values.`,
  parseUnits('250000', 18),
  parseUnits('1000000', 18),
  BigNumber.from(0),
  DateTime.fromSeconds(1649851200),
  false,
  false,
  AddressZero,
  new Amount<Token>(MAINNET_NODE, parseUnits('100000', MAINNET_NODE.decimals)),
  new Amount<Token>(MAINNET_NODE, parseUnits('0', MAINNET_NODE.decimals))
)

export const DAPPNODE_TEST_KPI_TOKEN_3 = new KpiToken(
  ChainId.MAINNET,
  AddressZero,
  'NODEPRICE-0502',
  'NODE price 05-02',
  formatBytes32String('1234567890-test'),
  parseUnits('100000', 18),
  AddressZero,
  `# Will the average price of NODE from Feb 23rd to May 2nd be above 0.4 USD to 1 USD?
  
  ## Details
  This campaign will pay out in the range of 0.4 USD to 1 USD, with no payout when the result is below 0.4 USD and increasing linear payout over the range with a full collateral payout when the result is 1 USD or higher.
  
  ## Calculating the final answer
  The dedicated chart on the official carrot.eth frontend will show price data for NODE in the specified date range. Each data point represents a price reading taken each day at 12:00 UTC. To calculate the final result, use the data for each data point and calculate the average between all the charted values.`,
  parseUnits('0.4', 18),
  parseUnits('1', 18),
  BigNumber.from(0),
  DateTime.fromSeconds(1651492800),
  false,
  false,
  AddressZero,
  new Amount<Token>(MAINNET_NODE, parseUnits('100000', MAINNET_NODE.decimals)),
  new Amount<Token>(MAINNET_NODE, parseUnits('0', MAINNET_NODE.decimals))
)
