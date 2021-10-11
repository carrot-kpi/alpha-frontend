import { Amount, ChainId, Currency, Token } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { ChartDataPoint, DexPlatform, TokenPricePlatform } from '..'
import { getBlocksFromTimestamps, getDailyTimestampFromRange } from '../../../../utils'
import { gql } from 'graphql-request'
import { SWAPR_SUBGRAPH_CLIENT } from '../../../graphql'
import { parseUnits } from '@ethersproject/units'
import Decimal from 'decimal.js-light'

export class Swapr implements DexPlatform {
  get name(): string {
    return 'Swapr'
  }

  public async pairDailyTvl(tokenA: Token, tokenB: Token, from: DateTime, to: DateTime): Promise<ChartDataPoint[]> {
    if (tokenA.chainId !== tokenB.chainId || !this.supportsChain(tokenA.chainId))
      throw new Error('tried to get swapr pair day tvl data on an invalid chain')
    const chainId = tokenA.chainId
    const subgraph = SWAPR_SUBGRAPH_CLIENT[chainId]
    if (!subgraph) throw new Error('could not get swapr subgraph client')

    const timestamps = getDailyTimestampFromRange(from, to)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    const [token0, token1] =
      tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA]

    let data = await subgraph.request<{
      [timestampString: string]: { reserveUSD: string }[]
    }>(gql`
      query pairDailyTvl {
        ${blocks.map((block) => {
          return `t${
            block.timestamp
          }: pairs(where: { token0: "${token0.address.toLowerCase()}", token1: "${token1.address.toLowerCase()}" }, block: { number: ${
            block.number
          } }) {
              reserveUSD
          }`
        })} 
      }
    `)

    return Object.entries(data).reduce((accumulator: ChartDataPoint[], [timestampString, pairs]) => {
      if (pairs.length === 1) {
        accumulator.push({
          x: parseInt(timestampString.substring(1)),
          y: pairs[0].reserveUSD,
        })
      }
      return accumulator
    }, [])
  }

  public async dailyOverallTvl(
    chainId: ChainId,
    _pricingPlatform: TokenPricePlatform, // ignored
    from: DateTime,
    to: DateTime
  ): Promise<ChartDataPoint[]> {
    if (!this.supportsChain(chainId)) throw new Error('tried to get swapr overall day tvl data on an invalid chain')
    const subgraph = SWAPR_SUBGRAPH_CLIENT[chainId]
    if (!subgraph) throw new Error('could not get swapr subgraph client')

    const timestamps = getDailyTimestampFromRange(from, to)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    let data = await subgraph.request<{
      [timestampString: string]: { totalLiquidityUSD: string }[]
    }>(gql`
      query overallDailyTvl {
        ${blocks.map((block) => {
          return `t${block.timestamp}: swaprFactories(block: { number: ${block.number} }) {
            totalLiquidityUSD
          }`
        })} 
      }
    `)

    return Object.entries(data).reduce((accumulator: ChartDataPoint[], [timestampString, factories]) => {
      if (factories.length === 1) {
        accumulator.push({
          x: parseInt(timestampString.substring(1)),
          y: factories[0].totalLiquidityUSD,
        })
      }
      return accumulator
    }, [])
  }

  public async dailyTokenPrice(token: Token, from: DateTime, to: DateTime): Promise<ChartDataPoint[]> {
    const chainId = token.chainId
    if (!this.supportsChain(chainId)) throw new Error('tried to get swapr daily token price data on an invalid chain')
    const nativeCurrency = Currency.getNative(chainId)
    if (!nativeCurrency) throw new Error(`no native currency for chain id ${chainId}`)
    const subgraph = SWAPR_SUBGRAPH_CLIENT[chainId]
    if (!subgraph) throw new Error('could not get swapr subgraph client')

    const timestamps = getDailyTimestampFromRange(from, to)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    if (Token.getNativeWrapper(chainId).equals(token)) {
      let nativeCurrencyUsdData = await subgraph.request<{
        [timestampString: string]: { nativeCurrencyPrice: string }
      }>(gql`
        query dailyNativeCurrencyPrice {
          ${blocks.map((block) => {
            return `t${block.timestamp}: bundle(id: "1", block: { number: ${block.number} }) {
              nativeCurrencyPrice
            }`
          })} 
        }
      `)
      return Object.entries(nativeCurrencyUsdData).reduce(
        (accumulator: ChartDataPoint[], [timestampString, nativeCurrencyData]) => {
          const { nativeCurrencyPrice } = nativeCurrencyData
          accumulator.push({
            x: parseInt(timestampString.substring(1)),
            y: new Amount(
              Currency.USD,
              parseUnits(new Decimal(nativeCurrencyPrice).toFixed(Currency.USD.decimals), Currency.USD.decimals)
            ).toFixed(2),
          })
          return accumulator
        },
        []
      )
    }

    let tokenPriceNativeCurrencyData = await subgraph.request<{
      [timestampString: string]: { derivedNativeCurrency: string }
    }>(gql`
      query dailyTokenPrice {
        ${blocks.map((block) => {
          return `t${block.timestamp}: token(id: "${token.address.toLowerCase()}", block: { number: ${block.number} }) {
            derivedNativeCurrency
          }`
        })} 
      }
    `)

    let nativeCurrencyUsdData = await subgraph.request<{
      [timestampString: string]: { nativeCurrencyPrice: string }
    }>(gql`
      query dailyNativeCurrencyPrice {
        ${blocks.map((block) => {
          return `t${block.timestamp}: bundle(id: "1", block: { number: ${block.number} }) {
            nativeCurrencyPrice
          }`
        })} 
      }
    `)

    return Object.entries(tokenPriceNativeCurrencyData).reduce(
      (accumulator: ChartDataPoint[], [timestampString, token]) => {
        const { nativeCurrencyPrice } = nativeCurrencyUsdData[timestampString]
        accumulator.push({
          x: parseInt(timestampString.substring(1)),
          y: new Amount(
            nativeCurrency,
            parseUnits(
              new Decimal(token.derivedNativeCurrency).toFixed(nativeCurrency.decimals),
              nativeCurrency.decimals
            )
          )
            .multiply(
              new Amount(
                Currency.USD,
                parseUnits(new Decimal(nativeCurrencyPrice).toFixed(Currency.USD.decimals), Currency.USD.decimals)
              )
            )
            .toFixed(2),
        })
        return accumulator
      },
      []
    )
  }

  public supportsChain(chainId: ChainId): boolean {
    return chainId === ChainId.XDAI || chainId === ChainId.RINKEBY
  }
}
