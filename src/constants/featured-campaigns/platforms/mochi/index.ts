import { Amount, ChainId, Currency, Token } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { ChartDataPoint, TokenPricePlatform, TvlPlatform } from '..'
import { getBlocksFromTimestamps, getTimestampsFromRange } from '../../../../utils'
import { USDM } from '../../../tokens'
import { MOCHI_SUBGRAPH_CLIENT } from '../../../graphql'
import { gql } from '@apollo/client'
import Decimal from 'decimal.js-light'
import { parseEther } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'

export class Mochi implements TokenPricePlatform, TvlPlatform {
  get name(): string {
    return 'Curve USDM metapool'
  }

  public async tokenPrice(token: Token, from: DateTime, to: DateTime, granularity: number): Promise<ChartDataPoint[]> {
    const chainId = token.chainId
    if (!token.equals(USDM)) throw new Error('mochi usdm platform only supports usdm')

    const subgraph = MOCHI_SUBGRAPH_CLIENT[ChainId.MAINNET]
    if (!subgraph) throw new Error('could not get mochi subgraph client')

    const timestamps = getTimestampsFromRange(from, to, granularity)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    const { data: tokenPrices } = await subgraph.query<{
      [timestampString: string]: { price: string }
    }>({
      query: gql`
        query tokenPrice {
          ${blocks.map((block) => {
            return `t${block.timestamp}: price(id: "1", block: { number: ${block.number} }) {
              price
            }`
          })} 
        }
      `,
    })

    return Object.entries(tokenPrices).map(([timestampString, token]) => ({
      x: parseInt(timestampString.substring(1)),
      y: new Decimal(token.price).toFixed(2),
    }))
  }

  public async overallTvl(
    chainId: ChainId,
    _pricingPlatform: TokenPricePlatform,
    from: DateTime,
    to: DateTime,
    granularity: number
  ): Promise<ChartDataPoint[]> {
    if (!this.supportsChain(chainId))
      throw new Error('tried to get mochi usdm metapool overall day tvl data on an invalid chain')
    const subgraph = MOCHI_SUBGRAPH_CLIENT[chainId]
    if (!subgraph) throw new Error('could not get mochi subgraph client')

    const timestamps = getTimestampsFromRange(from, to, granularity)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    let { data } = await subgraph.query<{
      [timestampString: string]: { lpTokenPrice: string; lpTokenSupply: string }
    }>({
      query: gql`
        query overallTvl {
          ${blocks.map((block) => {
            return `t${block.timestamp}: liquidity(id: "1", block: { number: ${block.number} }) {
              lpTokenPrice
              lpTokenSupply
            }`
          })} 
        }
      `,
    })

    return Object.entries(data).reduce((accumulator: ChartDataPoint[], [timestampString, liquidity]) => {
      accumulator.push({
        x: parseInt(timestampString.substring(1)),
        y: new Amount(
          Currency.USD,
          BigNumber.from(liquidity.lpTokenSupply).mul(liquidity.lpTokenPrice).div(parseEther('1'))
        ).toFixed(2),
      })
      return accumulator
    }, [])
  }

  public supportsChain(chainId: ChainId): boolean {
    return chainId === ChainId.MAINNET
  }
}
