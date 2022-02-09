import { ChainId, Metric, Swapr, Mochi, PairLiquidityMetric, TokenPriceMetric, TvlMetric } from '@carrot-kpi/sdk'
import { AddressZero } from '@ethersproject/constants'
import { DateTime } from 'luxon'
import { Creator, DXDAO, MOCHI } from '../creators'
import { DXD, XDAI_WETH, SWPR, USDM, MOCHI_TEST_KPI_TOKEN } from '../tokens'

export interface FeaturedCampaign {
  metrics: Metric[]
  id: string
  kpiId: string
  creator: Creator
}

const swapr = new Swapr()
const mochi = new Mochi()

export const FEATURED_CAMPAIGNS: { [chainId in ChainId]: FeaturedCampaign[] } = {
  [ChainId.MAINNET]: [
    // TODO: remove this, it's for test purposes!
    {
      metrics: [
        new TokenPriceMetric(
          USDM,
          mochi,
          DateTime.fromSeconds(1638360000), // Dec 1st 1200 UTC
          DateTime.fromSeconds(1640952000), // Dec 31th 1200 UTC
          86400
        ),
        new TvlMetric(
          ChainId.MAINNET,
          mochi, // ignored
          mochi,
          DateTime.fromSeconds(1635771600), // Dec 1st 1200 UTC
          DateTime.fromSeconds(1638280800), // Dec 31th 1200 UTC
          86400
        ),
      ],
      id: AddressZero,
      kpiId: MOCHI_TEST_KPI_TOKEN.kpiId,
      creator: MOCHI,
    },
  ],
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
      metrics: [],
      id: '0x50b95f4cd35db87c9ee36b5a653e1ad397e93927',
      kpiId: '0xc32b79923358551009f7fade6f91d119911eebe0e4030fbce798d799aae7afdb',
      creator: DXDAO,
    },
  ],
}
