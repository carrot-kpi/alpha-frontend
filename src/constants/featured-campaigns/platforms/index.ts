import { ChainId, Token } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { TotalSupplyToken } from '../../tokens'

export interface ChartDataPoint {
  x: number
  y: string
}

export interface Platform {
  supportsChain(chainId: ChainId): boolean
  get name(): string
}

export interface TvlPlatform extends Platform {
  overallTvl(
    chainId: ChainId,
    pricingPlatform: TokenPricePlatform,
    from: DateTime,
    to: DateTime,
    granularity: number
  ): Promise<ChartDataPoint[]>
}

export interface TokenPricePlatform extends Platform {
  tokenPrice(token: Token, from: DateTime, to: DateTime, granularity: number): Promise<ChartDataPoint[]>
}

export interface TokenMarketCapPlatform extends Platform {
  tokenMarketCap(token: TotalSupplyToken, from: DateTime, to: DateTime, granularity: number): Promise<ChartDataPoint[]>
}

export interface DexPlatform extends TvlPlatform, TokenPricePlatform, TokenMarketCapPlatform {
  pairTvl(tokenA: Token, tokenB: Token, from: DateTime, to: DateTime, granularity: number): Promise<ChartDataPoint[]>
}
