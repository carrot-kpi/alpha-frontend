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
import {
  Creator,
  /* DAPPNODE, */ DXDAO,
  HOPR as HOPR_CREATOR /* MOCHI */,
  HUNDRED_FINANCE,
  COW as COW_CREATOR,
} from '../creators'
import {
  DXD,
  GNOSIS_WETH,
  SWPR,
  HOPR,
  WXDAI,
  HND,
  COW,
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
          GNOSIS_WETH,
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
  [ChainId.GNOSIS]: [
    {
      metrics: [
        new TvlMetric(
          ChainId.GNOSIS,
          swapr,
          swapr,
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          DateTime.fromSeconds(1649948400), // Apr 14th 1500 UTC
          86400
        ),
      ],
      id: '0xb56db053585850306d55971e8b9c1396429e33a1',
      kpiId: '0x50c2c3036a31d508a41836cd0d64c806deca223da7d5166562b4d89537aebcae',
      creator: DXDAO,
    },
    {
      metrics: [
        new TvlMetric(
          ChainId.GNOSIS,
          swapr,
          swapr,
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          DateTime.fromSeconds(1649948400), // Apr 14th 1500 UTC
          86400
        ),
      ],
      id: '0x6a175ba204123d08f91d9e20d34fceac7a4ab43d',
      kpiId: '0xda924e9cd6e1a6ce3220db202ef8e188cae5440b27e6e70a3defd18abe5772c7',
      creator: DXDAO,
    },
    {
      metrics: [
        new PairLiquidityMetric(
          WXDAI,
          HOPR,
          swapr,
          DateTime.fromSeconds(1647529200), // Mar 17th 1500 UTC
          DateTime.fromSeconds(1649948400), // Apr 14th 1500 UTC
          86400
        ),
      ],
      id: '0x51c975e56a96c434b9a1b843cbf10bc37b56632e',
      kpiId: '0xe3899be8de3fe5f82e47a1474a30fd7fd262f9bbb61ccc32d0da6aab7e0616c6',
      creator: HOPR_CREATOR,
    },
    {
      metrics: [
        new PairLiquidityMetric(
          WXDAI,
          HND,
          swapr,
          DateTime.fromSeconds(1647993600), // Mar 23rd 1500 UTC
          DateTime.fromSeconds(1649948400), // Apr 14th 1500 UTC
          86400
        ),
      ],
      id: '0xf859bab2889e22e4e5a612780abaf71a8f226a0d',
      kpiId: '0xd415b798f6f5e2af57fca69aba19bb8ae6615b74cf917021593d42f3960eda7a',
      creator: HUNDRED_FINANCE,
    },
    {
      metrics: [
        new PairLiquidityMetric(
          GNOSIS_WETH,
          COW,
          swapr,
          DateTime.fromSeconds(1648566000), // Mar 29th 1500 UTC
          DateTime.fromSeconds(1649948400), // Apr 14th 1500 UTC
          86400
        ),
      ],
      id: '0x2569db67431b30f027083345208e77232f470e7f',
      kpiId: '0x8d96b649698862bb79638b5e6a249dfee4bf9c2e0e153033da7c5a84a94d94e9',
      creator: COW_CREATOR,
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
  ],
}
