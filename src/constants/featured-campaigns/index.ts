import {
  ChainId,
  Metric,
  Swapr,
  // Mochi,
  PairLiquidityMetric,
  TokenPriceMetric,
  TvlMetric,
  // UniswapV2,
  // Honeyswap,
} from '@carrot-kpi/sdk'
// import { AddressZero } from '@ethersproject/constants'
import { DateTime } from 'luxon'
import { Creator, /* DAPPNODE, */ DXDAO, HOPR as HOPR_CREATOR /* MOCHI */ } from '../creators'
import {
  DXD,
  XDAI_WETH,
  SWPR,
  HOPR,
  WXDAI,
  /* USDM,
  MOCHI_TEST_KPI_TOKEN, */
  /* DAPPNODE_TEST_KPI_TOKEN_1,
  XDAI_NODE,
  DAPPNODE_TEST_KPI_TOKEN_3, */
  /* DAPPNODE_TEST_KPI_TOKEN_2,
  MAINNET_NODE,
  MAINNET_WETH, */
} from '../tokens'

export interface FeaturedCampaign {
  metrics: Metric[]
  id: string
  kpiId: string
  creator: Creator
}

const swapr = new Swapr()
// const mochi = new Mochi()
// const uniswapV2 = new UniswapV2()
// const honeyswap = new Honeyswap()

export const FEATURED_CAMPAIGNS: { [chainId in ChainId]: FeaturedCampaign[] } = {
  // TODO: remove this, it's for test purposes!
  [ChainId.MAINNET]: [
    /* {
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
    }, */
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
          DateTime.fromSeconds(1645110000), // Feb 17th 1500 UTC
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          86400
        ),
      ],
      id: '0x17e0106ec9aa44b4a659b144fb93ae481f06c74d',
      kpiId: '0xff160f93b0ab8e4470176218e7963f1290277a4cfdb67d509a38419ee6f39488',
      creator: DXDAO,
    },
    {
      metrics: [
        new TvlMetric(
          ChainId.XDAI,
          swapr,
          swapr,
          DateTime.fromSeconds(1645110000), // Feb 17th 1500 UTC
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          86400
        ),
      ],
      id: '0x3ee29f26cd964c03572443730a5f503da8fe0004',
      kpiId: '0xa5bb8d05a96adc31880b740e61efacd4213bd8f7ab9ce5f44f37193cff17439a',
      creator: DXDAO,
    },
    {
      metrics: [
        new PairLiquidityMetric(
          WXDAI,
          HOPR,
          swapr,
          DateTime.fromSeconds(1645110000), // Feb 17th 1500 UTC
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          86400
        ),
      ],
      id: '0x715e1bb4948253050cd41d11f282c366a5564477',
      kpiId: '0x4aabf5bb8662f4538bf9ab883b2eafa7e1a61211bdf8edbc2c9dc1ed24053418',
      creator: HOPR_CREATOR,
    },
    /* {
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
    }, */
    /* {
      metrics: [],
      id: '0x50b95f4cd35db87c9ee36b5a653e1ad397e93927',
      kpiId: '0xc32b79923358551009f7fade6f91d119911eebe0e4030fbce798d799aae7afdb',
      creator: DXDAO,
    }, */
  ],
}
