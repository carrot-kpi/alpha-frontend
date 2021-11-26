import { ChainId } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { Creator, DXDAO } from '../creators'
import { DXD, XDAI_WETH, SWPR } from '../tokens'
import { Metric, PairLiquidityMetric, TokenPriceMetric } from './metrics'
// import { Agave } from './platforms/agave'
import { Swapr } from './platforms/swapr'

export interface FeaturedCampaign {
  metrics: Metric[]
  id: string
  kpiId: string
  creator: Creator
}

export enum Platform {
  SWAPR,
  AGAVE,
}

const swapr = new Swapr()
// const agave = new Agave()

export const FEATURED_CAMPAIGNS: { [chainId in ChainId]: FeaturedCampaign[] } = {
  [ChainId.RINKEBY]: [
    {
      metrics: [
        new PairLiquidityMetric(
          DXD,
          XDAI_WETH,
          swapr,
          DateTime.fromSeconds(1638360000), // Dec 1st 1200 UTC
          DateTime.fromSeconds(1640952000), // Dec 31th 1200 UTC
          86400
        ),
      ],
      id: '0xf9cec6622e9aba9f84feb6b1e242c02357c62c72',
      kpiId: '0x2cba9605854882fa57383dd520485e2837caf3bebcc004b50e978d8d81c8ad73',
      creator: DXDAO,
    },
    {
      metrics: [
        new TokenPriceMetric(
          SWPR,
          swapr,
          DateTime.fromSeconds(1638360000), // Dec 1st 1200 UTC
          DateTime.fromSeconds(1640952000), // Dec 31th 1200 UTC
          86400
        ),
      ],
      id: '0x5b34994397dee11d2d403e5879bc256c30056120',
      kpiId: '0xcc12b3e93819f18a34a0e388a0d1a54da253d8ff5e2a25a72a0cd91336f8689c',
      creator: DXDAO,
    },
  ],
  [ChainId.XDAI]: [
    {
      metrics: [
        new PairLiquidityMetric(
          DXD,
          XDAI_WETH,
          swapr,
          DateTime.fromSeconds(1636545600), // Dec 1st 1200 UTC
          DateTime.fromSeconds(1640952000), // Dec 31th 1200 UTC
          86400
        ),
      ],
      id: '0x81bfbf1ed75b5d725c6bb60817ca0a5e30589907',
      kpiId: '0xb14fbca57adf524a30a517eaaf012cafc1227782aea1e900fbba1fb7c8ba5993',
      creator: DXDAO,
    },
    {
      metrics: [
        new TokenPriceMetric(
          SWPR,
          swapr,
          DateTime.fromSeconds(1638360000), // Dec 1st 1200 UTC
          DateTime.fromSeconds(1640952000), // Dec 31th 1200 UTC
          86400
        ),
      ],
      id: '0x8dc2a6919eb14ea6ea1869240965322ec092aada',
      kpiId: '0xbf6d4e50a9142bf3466c7ec687f1ddb403994a28bfe78d457301a5230d07c281',
      creator: DXDAO,
    },
  ],
}
