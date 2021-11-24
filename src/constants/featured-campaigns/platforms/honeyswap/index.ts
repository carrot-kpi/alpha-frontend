import { Amount, ChainId, Currency, Token } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { ChartDataPoint, DexPlatform, TokenPricePlatform } from '..'
import { getBlocksFromTimestamps, getTimestampsFromRange } from '../../../../utils'
import { gql } from 'graphql-request'
import { HONEYSWAP_SUBGRAPH_CLIENT } from '../../../graphql'
import { parseUnits } from '@ethersproject/units'
import Decimal from 'decimal.js-light'
import { TotalSupplyToken } from '../../../tokens'

export class Honeyswap implements DexPlatform {
  get name(): string {
    return 'Honeyswap'
  }

  public async pairDailyTvl(
    tokenA: Token,
    tokenB: Token,
    from: DateTime,
    to: DateTime,
    granularity: number
  ): Promise<ChartDataPoint[]> {
    if (tokenA.chainId !== tokenB.chainId || !this.supportsChain(tokenA.chainId))
      throw new Error('tried to get honeyswap pair day tvl data on an invalid chain')
    const chainId = tokenA.chainId
    const subgraph = HONEYSWAP_SUBGRAPH_CLIENT[chainId]
    if (!subgraph) throw new Error('could not get honeyswap subgraph client')

    const timestamps = getTimestampsFromRange(from, to, granularity)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    const [token0, token1] =
      tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA]

    let data = await subgraph.request<{
      [timestampString: string]: { reserveUSD: string }[]
    }>(
      gql`
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
        }`
    )

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
    to: DateTime,
    granularity: number
  ): Promise<ChartDataPoint[]> {
    if (!this.supportsChain(chainId)) throw new Error('tried to get honeyswap overall day tvl data on an invalid chain')
    const subgraph = HONEYSWAP_SUBGRAPH_CLIENT[chainId]
    if (!subgraph) throw new Error('could not get honeyswap subgraph client')

    const timestamps = getTimestampsFromRange(from, to, granularity)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    let data = await subgraph.request<{
      [timestampString: string]: { totalLiquidityUSD: string }[]
    }>(
      gql`
      query overallDailyTvl {
        ${blocks.map((block) => {
          return `t${block.timestamp}: uniswapFactories(block: { number: ${block.number} }) {
            totalLiquidityUSD
          }`
        })} 
      }`
    )

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

  public async dailyTokenPrice(
    token: Token,
    from: DateTime,
    to: DateTime,
    granularity: number
  ): Promise<ChartDataPoint[]> {
    const chainId = token.chainId
    if (!this.supportsChain(chainId))
      throw new Error('tried to get honeyswap daily token price data on an invalid chain')
    const nativeCurrency = Currency.getNative(chainId)
    if (!nativeCurrency) throw new Error(`no native currency for chain id ${chainId}`)
    const subgraph = HONEYSWAP_SUBGRAPH_CLIENT[chainId]
    if (!subgraph) throw new Error('could not get honeyswap subgraph client')

    const timestamps = getTimestampsFromRange(from, to, granularity)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    if (Token.getNativeWrapper(chainId).equals(token)) {
      const nativeCurrencyUsdData = await subgraph.request<{
        [timestampString: string]: { ethPrice: string }
      }>(gql`
        query dailyNativeCurrencyPrice {
          ${blocks.map((block) => {
            return `t${block.timestamp}: bundle(id: "1", block: { number: ${block.number} }) {
              ethPrice
            }`
          })} 
        }
      `)
      return Object.entries(nativeCurrencyUsdData).reduce(
        (accumulator: ChartDataPoint[], [timestampString, nativeCurrencyData]) => {
          const { ethPrice } = nativeCurrencyData
          accumulator.push({
            x: parseInt(timestampString.substring(1)),
            y: new Amount(
              Currency.USD,
              parseUnits(new Decimal(ethPrice).toFixed(Currency.USD.decimals), Currency.USD.decimals)
            ).toFixed(2),
          })
          return accumulator
        },
        []
      )
    }

    const tokenPriceNativeCurrencyData = await subgraph.request<{
      [timestampString: string]: { derivedETH: string }
    }>(gql`
      query dailyTokenPrice {
        ${blocks.map((block) => {
          return `t${block.timestamp}: token(id: "${token.address.toLowerCase()}", block: { number: ${block.number} }) {
            derivedETH
          }`
        })} 
      }
    `)

    const nativeCurrencyUsdData = await subgraph.request<{
      [timestampString: string]: { ethPrice: string }
    }>(gql`
      query dailyNativeCurrencyPrice {
        ${blocks.map((block) => {
          return `t${block.timestamp}: bundle(id: "1", block: { number: ${block.number} }) {
            ethPrice
          }`
        })} 
      }
    `)

    return Object.entries(tokenPriceNativeCurrencyData).reduce(
      (accumulator: ChartDataPoint[], [timestampString, token]) => {
        const { ethPrice } = nativeCurrencyUsdData[timestampString]
        accumulator.push({
          x: parseInt(timestampString.substring(1)),
          y: new Amount(
            nativeCurrency,
            parseUnits(new Decimal(token.derivedETH).toFixed(nativeCurrency.decimals), nativeCurrency.decimals)
          )
            .multiply(
              new Amount(
                Currency.USD,
                parseUnits(new Decimal(ethPrice).toFixed(Currency.USD.decimals), Currency.USD.decimals)
              )
            )
            .toFixed(2),
        })
        return accumulator
      },
      []
    )
  }

  public async dailyTokenMarketCap(
    token: TotalSupplyToken,
    from: DateTime,
    to: DateTime,
    granularity: number
  ): Promise<ChartDataPoint[]> {
    const chainId = token.chainId
    if (!this.supportsChain(chainId))
      throw new Error('tried to get honeyswap daily token mcap data on an invalid chain')
    if (Token.getNativeWrapper(chainId).equals(token)) throw new Error('cannot get mcap of native currency')
    const nativeCurrency = Currency.getNative(chainId)
    if (!nativeCurrency) throw new Error(`no native currency for chain id ${chainId}`)
    const subgraph = HONEYSWAP_SUBGRAPH_CLIENT[chainId]
    if (!subgraph) throw new Error('could not get honeyswap subgraph client')

    const timestamps = getTimestampsFromRange(from, to, granularity)
    const blocks = await getBlocksFromTimestamps(chainId, timestamps)
    if (blocks.length === 0) return []

    const tokenPriceNativeCurrencyData = await subgraph.request<{
      [timestampString: string]: { derivedETH: string }
    }>(gql`
      query dailyTokenPrice {
        ${blocks.map((block) => {
          return `t${block.timestamp}: token(id: "${token.address.toLowerCase()}", block: { number: ${block.number} }) {
            derivedETH
          }`
        })} 
      }
    `)

    const nativeCurrencyUsdData = await subgraph.request<{
      [timestampString: string]: { ethPrice: string }
    }>(gql`
      query dailyNativeCurrencyPrice {
        ${blocks.map((block) => {
          return `t${block.timestamp}: bundle(id: "1", block: { number: ${block.number} }) {
            ethPrice
          }`
        })} 
      }
    `)

    const tokenTotalSupply = await token.totalSupply()

    return Object.entries(tokenPriceNativeCurrencyData).reduce(
      (accumulator: ChartDataPoint[], [timestampString, token]) => {
        if (!token) return accumulator
        const { ethPrice } = nativeCurrencyUsdData[timestampString]
        const usdPrice = new Amount(
          nativeCurrency,
          parseUnits(new Decimal(token.derivedETH).toFixed(nativeCurrency.decimals), nativeCurrency.decimals)
        ).multiply(
          new Amount(
            Currency.USD,
            parseUnits(new Decimal(ethPrice).toFixed(Currency.USD.decimals), Currency.USD.decimals)
          )
        )
        accumulator.push({
          x: parseInt(timestampString.substring(1)),
          y: usdPrice.times(tokenTotalSupply).toFixed(2),
        })
        return accumulator
      },
      []
    )
  }

  public supportsChain(chainId: ChainId): boolean {
    return chainId === ChainId.XDAI
  }
}
