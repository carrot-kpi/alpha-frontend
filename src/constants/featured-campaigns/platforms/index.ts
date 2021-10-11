import { ChainId, Token } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'

export interface ChartDataPoint {
  x: number
  y: string
}

export interface Platform {
  supportsChain(chainId: ChainId): boolean
  get name(): string
}

export interface TvlPlatform extends Platform {
  dailyOverallTvl(
    chainId: ChainId,
    pricingPlatform: TokenPricePlatform,
    from: DateTime,
    to: DateTime
  ): Promise<ChartDataPoint[]>
}

export interface TokenPricePlatform extends Platform {
  dailyTokenPrice(token: Token, from: DateTime, to: DateTime): Promise<ChartDataPoint[]>
}

export interface DexPlatform extends TvlPlatform, TokenPricePlatform {
  pairDailyTvl(tokenA: Token, tokenB: Token, from: DateTime, to: DateTime): Promise<ChartDataPoint[]>
}
