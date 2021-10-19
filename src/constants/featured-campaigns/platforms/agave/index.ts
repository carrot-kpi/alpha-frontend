import { Amount, ChainId, Currency, Token } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { ChartDataPoint, TokenPricePlatform, TvlPlatform } from '..'
import { getBlocksFromTimestamps, getTimestampsFromRange } from '../../../../utils'
import { gql } from 'graphql-request'
import { AGAVE_SUBGRAPH_CLIENT } from '../../../graphql'
import { parseUnits } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'
import Decimal from 'decimal.js-light'
import { getAddress } from '@ethersproject/address'

interface Reserve {
  price: { priceInEth: string }
  decimals: number
  symbol: string
  name: string
  underlyingAsset: string
  totalLiquidity: string
}

export class Agave implements TvlPlatform {
  get name(): string {
    return 'Agave'
  }

  public async dailyOverallTvl(
    chainId: ChainId,
    pricingPlatform: TokenPricePlatform,
    from: DateTime,
    to: DateTime,
    granularity: number
  ): Promise<ChartDataPoint[]> {
    if (!this.supportsChain(chainId)) throw new Error('tried to get agave overall daily tvl data on an invalid chain')
    const nativeCurrency = Currency.getNative(chainId)
    if (!nativeCurrency) throw new Error(`cannot find native currency for chain id ${chainId}`)
    const subgraph = AGAVE_SUBGRAPH_CLIENT[chainId]
    if (!subgraph) throw new Error('could not get agave subgraph client')

    const timestamps = getTimestampsFromRange(from, to, granularity)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    const agaveTvlData = await subgraph.request<{
      [timestampString: string]: { reserves: Reserve[] }[]
    }>(gql`
      query overallDailyTvl {
        ${blocks.map((block) => {
          return `t${block.timestamp}: pools(block: { number: ${block.number} }) {
            reserves(where: { totalLiquidity_gt: 0 }) {
              price {
                priceInEth
              }
              decimals
              name
              symbol
              underlyingAsset
              totalLiquidity
            }
          }`
        })} 
      }`)
    const nativeCurrencyPriceUsd = await pricingPlatform.dailyTokenPrice(
      Token.getNativeWrapper(chainId),
      from,
      to,
      granularity
    )
    const nativeCurrencyPriceUsdLookup = nativeCurrencyPriceUsd.reduce(
      (accumulator: { [timestampString: string]: Amount<Currency> }, item) => {
        accumulator[item.x] = new Amount(
          Currency.USD,
          parseUnits(new Decimal(item.y).toFixed(Currency.USD.decimals), Currency.USD.decimals)
        )
        return accumulator
      },
      {}
    )

    return Object.entries(agaveTvlData).reduce((accumulator: ChartDataPoint[], [timestampString, wrappedReserves]) => {
      let overallUsdReserve = new Amount(Currency.USD, BigNumber.from('0'))
      const timestamp = parseInt(timestampString.substring(1))

      for (const { reserves } of wrappedReserves) {
        for (const reserve of reserves) {
          const totalLiquidityBn = BigNumber.from(reserve.totalLiquidity)
          if (totalLiquidityBn.isZero()) continue
          const reserveAmount = new Amount(
            new Token(chainId, getAddress(reserve.underlyingAsset), reserve.decimals, reserve.symbol, reserve.name),
            totalLiquidityBn
          )
          const tokenNativeCurrencyPrice = new Amount(
            nativeCurrency,
            parseUnits(reserve.price.priceInEth, Math.max(nativeCurrency.decimals - 8, 0))
          )
          overallUsdReserve = overallUsdReserve.plus(
            reserveAmount.multiply(tokenNativeCurrencyPrice).multiply(nativeCurrencyPriceUsdLookup[timestamp])
          )
        }
      }

      accumulator.push({
        x: timestamp,
        y: overallUsdReserve.toFixed(2),
      })
      return accumulator
    }, [])
  }

  public supportsChain(chainId: ChainId): boolean {
    return chainId === ChainId.XDAI || chainId === ChainId.RINKEBY
  }
}
