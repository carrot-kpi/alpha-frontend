import { ChainId } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { WBTC, DXD, XDAI_WETH, SWPR } from '../tokens'
import { Metric, PairLiquidityMetric, TokenMarketCapMetric, TokenPriceMetric, TvlMetric } from './metrics'
import { Agave } from './platforms/agave'
import { Swapr } from './platforms/swapr'

export interface FeaturedCampaign {
  metrics: Metric[]
  id: string
  kpiId: string
}

export enum Platform {
  SWAPR,
  AGAVE,
}

const swapr = new Swapr()
const agave = new Agave()

export const FEATURED_CAMPAIGNS: { [chainId in ChainId]: FeaturedCampaign[] } = {
  [ChainId.RINKEBY]: [
    {
      metrics: [
        new TvlMetric(
          ChainId.RINKEBY,
          swapr,
          agave,
          DateTime.fromFormat('19/10/2021', 'dd/MM/yyyy'),
          DateTime.fromFormat('20/10/2021', 'dd/MM/yyyy'),
          3600
        ),
        new TokenMarketCapMetric(
          WBTC,
          swapr,
          DateTime.fromFormat('19/10/2021', 'dd/MM/yyyy'),
          DateTime.fromFormat('20/10/2021', 'dd/MM/yyyy'),
          3600
        ),
      ],
      id: '0x08d40515dc4f407a7ee4a3ec452e1f1134308ff5',
      kpiId: '0x1c903a9a74aa4a3d5c3da94dcddbc6ebcb5cdb9eecb6fdddf9229d9edaa7f6d1',
    },
    {
      metrics: [
        new TvlMetric(ChainId.RINKEBY, swapr, agave, DateTime.now().minus({ days: 10 }), DateTime.now(), 86400),
      ],
      id: '0xa35ff0288c647f74ca0536dbf0aed820b66d27e4',
      kpiId: '0xefa2051e965e72c2776be6a870f8d25fc8bbde8af7b92e9a3e5adbae3f9923a9',
    },
    {
      metrics: [],
      id: '0x4b1363fe97eab90b76745095e508bbfa4783ae3f',
      kpiId: '0xa8195c2ad209cd6304582fd63bf02d49c8d5d869f14bab309939f6f7bff3311a',
    },
    {
      metrics: [],
      id: '0x91e60aa7b6d9cee6dc4fa160011a565295f536d9',
      kpiId: '0x1b6ae875354ff2f5abe915f849ed441785b9e878a431cd5df0b8246fd63785e1',
    },
  ],
  [ChainId.XDAI]: [
    {
      metrics: [
        new PairLiquidityMetric(
          DXD,
          XDAI_WETH,
          swapr,
          DateTime.fromFormat('01/11/2021', 'dd/MM/yyyy'),
          DateTime.fromFormat('20/11/2021', 'dd/MM/yyyy'),
          86400
        ),
      ],
      id: '0x902a3f970a2cfe7a667b80181fd5db06e340c7bb',
      kpiId: '0x500ea619e12630897f108a681c94400e65c2a93422cff31bc5a9ccd04d4f00f7',
    },
    {
      metrics: [
        new TokenPriceMetric(
          SWPR,
          swapr,
          DateTime.fromFormat('01/11/2021', 'dd/MM/yyyy'),
          DateTime.fromFormat('21/11/2021', 'dd/MM/yyyy'),
          86400
        ),
      ],
      id: '0x82489cad320e67311b6974315dfa322614afcc6a',
      kpiId: '0xc1a022649920a409b135931ea1ea89c048517365709a5dbf703459362b5607ab',
    },
  ],
}
