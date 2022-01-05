import { ChainId } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { AGAVE, Creator, DXDAO } from '../creators'
import { DXD, XDAI_WETH, SWPR } from '../tokens'
import { Metric, PairLiquidityMetric, TokenPriceMetric, TvlMetric } from './metrics'
import { Agave } from './platforms/agave'
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
const agave = new Agave()
// const mochi = new Mochi()

export const FEATURED_CAMPAIGNS: { [chainId in ChainId]: FeaturedCampaign[] } = {
  [ChainId.MAINNET]: [],
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
      id: '0xc94460e20d1c749879d68407718e61b6aed4d5b2',
      kpiId: '0x7806f9d92282783ee2b23cc7d2fa69861f66c0369c42ed41ac4c185fcc41ca4e',
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
      id: '0x4a791d577476ffd1e1fd1543f6fce0f71e1b04ef',
      kpiId: '0xe7b8d84f1b786de5ee9e3b52db613379aeccaa373ab880229d5adadc6348348c',
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
          DateTime.fromSeconds(1638360000), // Dec 1st 1200 UTC
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
    {
      metrics: [
        new TvlMetric(
          ChainId.XDAI,
          swapr,
          agave,
          DateTime.fromSeconds(1640433600), // Dec 25th 1200 UTC
          DateTime.fromSeconds(1640952000), // Dec 31th 1200 UTC
          86400
        ),
      ],
      id: '0xfd7e71a6b82c423b3dfc3b9b4dd854e3f1e468d2',
      kpiId: '0xa196c0e33df7a4b7729a2b3d3d3083d00510f05f932bfadabaa56bf8a8253c55',
      creator: AGAVE,
    },
  ],
}
