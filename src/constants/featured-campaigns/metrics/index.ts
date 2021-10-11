import { ChainId, Token } from '@carrot-kpi/sdk'
import { ChartDataPoint, DexPlatform, TokenPricePlatform, TvlPlatform } from '../platforms'
import { DateTime } from 'luxon'

export interface Metric {
  chartData(): Promise<ChartDataPoint[]>

  get name(): string
}

export class TvlMetric implements Metric {
  private readonly chainId: ChainId
  private readonly pricingPlatform: TokenPricePlatform
  private readonly platform: TvlPlatform
  private readonly from: DateTime
  private readonly to: DateTime

  constructor(
    chainId: ChainId,
    pricingPlatform: TokenPricePlatform,
    platform: TvlPlatform,
    from: DateTime,
    to: DateTime
  ) {
    this.chainId = chainId
    this.pricingPlatform = pricingPlatform
    this.platform = platform
    this.from = from
    this.to = to
  }

  get name(): string {
    return `${this.platform.name} TVL`
  }

  public async chartData(): Promise<ChartDataPoint[]> {
    return this.platform.dailyOverallTvl(this.chainId, this.pricingPlatform, this.from, this.to)
  }
}

export class TokenPriceMetric implements Metric {
  private readonly token: Token
  private readonly platform: TokenPricePlatform
  private readonly from: DateTime
  private readonly to: DateTime

  constructor(token: Token, platform: TokenPricePlatform, from: DateTime, to: DateTime) {
    this.token = token
    this.platform = platform
    this.from = from
    this.to = to
  }

  get name(): string {
    return `${this.token.symbol} USD price on ${this.platform.name}`
  }

  public async chartData(): Promise<ChartDataPoint[]> {
    return this.platform.dailyTokenPrice(this.token, this.from, this.to)
  }
}

export class PairLiquidityMetric implements Metric {
  private readonly tokenA: Token
  private readonly tokenB: Token
  private readonly platform: DexPlatform
  private readonly from: DateTime
  private readonly to: DateTime

  constructor(tokenA: Token, tokenB: Token, platform: DexPlatform, from: DateTime, to: DateTime) {
    this.tokenA = tokenA
    this.tokenB = tokenB
    this.platform = platform
    this.from = from
    this.to = to
  }

  get name(): string {
    return `${this.tokenA.symbol}/${this.tokenB.symbol} USD liquidity on ${this.platform.name}`
  }

  public async chartData(): Promise<ChartDataPoint[]> {
    return this.platform.pairDailyTvl(this.tokenA, this.tokenB, this.from, this.to)
  }
}
