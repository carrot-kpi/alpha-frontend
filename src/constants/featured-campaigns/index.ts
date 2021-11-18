import { ChainId } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { WBTC, STAKE } from '../tokens'
import { Metric, TokenMarketCapMetric, TvlMetric } from './metrics'
import { Agave } from './platforms/agave'
import { Honeyswap } from './platforms/honeyswap'
import { Swapr } from './platforms/swapr'

export interface FeaturedCampaign {
  metrics: Metric[]
  id: string
  kpiId: string
  startDate: DateTime
  endDate: DateTime
}

export enum Platform {
  SWAPR,
  AGAVE,
}

const swapr = new Swapr()
const honeyswap = new Honeyswap()
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
      startDate: DateTime.fromSeconds(1634642288),
      endDate: DateTime.fromSeconds(1634721488),
      id: '0x08d40515dc4f407a7ee4a3ec452e1f1134308ff5',
      kpiId: '0x1c903a9a74aa4a3d5c3da94dcddbc6ebcb5cdb9eecb6fdddf9229d9edaa7f6d1',
    },
    {
      metrics: [
        new TvlMetric(ChainId.RINKEBY, swapr, agave, DateTime.now().minus({ days: 10 }), DateTime.now(), 86400),
      ],
      startDate: DateTime.now().minus({ days: 10 }),
      endDate: DateTime.now(),
      id: '0xa35ff0288c647f74ca0536dbf0aed820b66d27e4',
      kpiId: '0xefa2051e965e72c2776be6a870f8d25fc8bbde8af7b92e9a3e5adbae3f9923a9',
    },
    {
      metrics: [],
      startDate: DateTime.now().minus({ days: 10 }),
      endDate: DateTime.now().plus({ days: 10 }),
      id: '0x4b1363fe97eab90b76745095e508bbfa4783ae3f',
      kpiId: '0xa8195c2ad209cd6304582fd63bf02d49c8d5d869f14bab309939f6f7bff3311a',
    },
    {
      metrics: [],
      startDate: DateTime.now().minus({ days: 10 }),
      endDate: DateTime.now().plus({ days: 10 }),
      id: '0x91e60aa7b6d9cee6dc4fa160011a565295f536d9',
      kpiId: '0x1b6ae875354ff2f5abe915f849ed441785b9e878a431cd5df0b8246fd63785e1',
    },
  ],
  [ChainId.XDAI]: [
    {
      metrics: [
        new TvlMetric(
          ChainId.XDAI,
          honeyswap,
          agave,
          DateTime.fromFormat('20/09/2021', 'dd/MM/yyyy'),
          DateTime.fromFormat('10/10/2021', 'dd/MM/yyyy'),
          86400
        ),
        new TokenMarketCapMetric(
          STAKE,
          honeyswap,
          DateTime.fromFormat('20/09/2021', 'dd/MM/yyyy'),
          DateTime.fromFormat('10/10/2021', 'dd/MM/yyyy'),
          86400
        ),
      ],
      startDate: DateTime.fromFormat('20/09/2021', 'dd/MM/yyyy'),
      endDate: DateTime.fromFormat('10/10/2021', 'dd/MM/yyyy'),
      id: '0x539b8d0f2ff2a44c48cc7f28a666d8a1c131346f',
      kpiId: '0xaa79603608b0afd28493637164a684361723674fb6aa1ca250dc819351b323dd',
    },
  ],
}
