import {
  ChainId,
  Metric,
  Swapr,
  Mochi,
  PairLiquidityMetric,
  TokenPriceMetric,
  TvlMetric,
  UniswapV2,
  Honeyswap,
} from '@carrot-kpi/sdk'
import { AddressZero } from '@ethersproject/constants'
import { DateTime } from 'luxon'
import { Creator, DAPPNODE, DXDAO, HOPR as HOPR_CREATOR, MOCHI } from '../creators'
import {
  DXD,
  XDAI_WETH,
  SWPR,
  SWAPR_GNO_TEST_KPI_TOKEN,
  SWAPR_SWPR_TEST_KPI_TOKEN,
  HOPR,
  HOPR_TEST_KPI_TOKEN,
  WXDAI,
  USDM,
  MOCHI_TEST_KPI_TOKEN,
  DAPPNODE_TEST_KPI_TOKEN_1,
  XDAI_NODE,
  DAPPNODE_TEST_KPI_TOKEN_2,
  MAINNET_NODE,
  DAPPNODE_TEST_KPI_TOKEN_3,
  MAINNET_WETH,
} from '../tokens'

export interface FeaturedCampaign {
  metrics: Metric[]
  id: string
  kpiId: string
  creator: Creator
}

const swapr = new Swapr()
const mochi = new Mochi()
const uniswapV2 = new UniswapV2()
const honeyswap = new Honeyswap()

export const FEATURED_CAMPAIGNS: { [chainId in ChainId]: FeaturedCampaign[] } = {
  // TODO: remove this, it's for test purposes!
  [ChainId.MAINNET]: [
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
    {
      metrics: [
        new PairLiquidityMetric(
          MAINNET_NODE,
          MAINNET_WETH,
          uniswapV2,
          DateTime.fromSeconds(1638360000), // Dec 1st 1200 UTC
          DateTime.fromSeconds(1640952000), // Dec 31th 1200 UTC
          86400
        ),
      ],
      id: AddressZero,
      kpiId: DAPPNODE_TEST_KPI_TOKEN_2.kpiId,
      creator: DAPPNODE,
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
        new TvlMetric(
          ChainId.XDAI,
          swapr,
          swapr,
          DateTime.fromSeconds(1638360000), // Feb 17th 1500 UTC
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          86400
        ),
      ],
      id: SWAPR_GNO_TEST_KPI_TOKEN.address,
      kpiId: SWAPR_GNO_TEST_KPI_TOKEN.kpiId,
      creator: DXDAO,
    },
    {
      metrics: [
        new TvlMetric(
          ChainId.XDAI,
          swapr,
          swapr,
          DateTime.fromSeconds(1638360000), // Feb 17th 1500 UTC
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          86400
        ),
      ],
      id: SWAPR_SWPR_TEST_KPI_TOKEN.address,
      kpiId: SWAPR_SWPR_TEST_KPI_TOKEN.kpiId,
      creator: DXDAO,
    },
    {
      metrics: [
        new PairLiquidityMetric(
          WXDAI,
          HOPR,
          swapr,
          DateTime.fromSeconds(1638360000), // Feb 17th 1500 UTC
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          86400
        ),
      ],
      id: HOPR_TEST_KPI_TOKEN.address,
      kpiId: HOPR_TEST_KPI_TOKEN.kpiId,
      creator: HOPR_CREATOR,
    },
    {
      metrics: [
        new PairLiquidityMetric(
          XDAI_NODE,
          XDAI_WETH,
          swapr,
          DateTime.fromSeconds(1644494400), // Feb 17th 1500 UTC
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          86400
        ),
      ],
      id: AddressZero,
      kpiId: DAPPNODE_TEST_KPI_TOKEN_1.kpiId,
      creator: DAPPNODE,
    },
    {
      metrics: [
        new TokenPriceMetric(
          XDAI_NODE,
          honeyswap,
          DateTime.fromSeconds(1638360000), // Dec 1st 1200 UTC
          DateTime.fromSeconds(1640952000), // Dec 31th 1200 UTC
          86400
        ),
      ],
      id: AddressZero,
      kpiId: DAPPNODE_TEST_KPI_TOKEN_3.kpiId,
      creator: DAPPNODE,
    },
    /* {
      metrics: [],
      id: '0x50b95f4cd35db87c9ee36b5a653e1ad397e93927',
      kpiId: '0xc32b79923358551009f7fade6f91d119911eebe0e4030fbce798d799aae7afdb',
      creator: DXDAO,
    }, */
  ],
}
