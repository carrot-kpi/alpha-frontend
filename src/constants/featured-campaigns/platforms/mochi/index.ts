import { ChainId, Token } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { ChartDataPoint, TokenPricePlatform } from '..'
import { getBlocksFromTimestamps, getTimestampsFromRange } from '../../../../utils'
import { USDM } from '../../../tokens'
import { USDM_SUBGRAPH_CLIENT } from '../../../graphql'
import { gql } from '@apollo/client'
import Decimal from 'decimal.js-light'

export class Mochi implements TokenPricePlatform {
  get name(): string {
    return 'Curve USDM metapool'
  }

  public async tokenPrice(token: Token, from: DateTime, to: DateTime, granularity: number): Promise<ChartDataPoint[]> {
    const chainId = token.chainId
    if (!token.equals(USDM)) throw new Error('mochi usdm platform only supports usdm')

    const timestamps = getTimestampsFromRange(from, to, granularity)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    const subgraph = USDM_SUBGRAPH_CLIENT[ChainId.MAINNET]
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

  public supportsChain(chainId: ChainId): boolean {
    return chainId === ChainId.MAINNET
  }
}
