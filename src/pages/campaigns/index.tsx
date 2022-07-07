import { ReactElement, useMemo, useState } from 'react'
import { Box, Flex, Text } from 'rebass'
import { useKpiTokenBalances } from '../../hooks/useKpiTokenBalances'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useKpiTokens } from '../../hooks/useKpiTokens'
import { CampaignCard } from '../../components/campaign-card'
import { Campaign, CAMPAIGNS } from '../../constants/campaigns'
import { usePage } from '../../hooks/usePage'
import { Pagination } from '../../components/pagination'
import { Switch } from '../../components/switch'

export default function Campaigns(): ReactElement {
  const { account, chainId } = useActiveWeb3React()

  const { kpiTokens, loading: loadingKpiTokens } = useKpiTokens()
  const { balances: kpiTokenBalances, loading: loadingKpiTokenBalances } = useKpiTokenBalances(kpiTokens, account)

  const filteredSortedKpiTokens = useMemo(() => {
    if (!chainId) return []
    return kpiTokens
      .filter(
        (kpiToken) =>
          !!CAMPAIGNS[chainId].find((campaign) => campaign.kpiId.toLowerCase() === kpiToken.kpiId.toLowerCase())
      )
      .sort((a, b) => {
        const aCampaign = CAMPAIGNS[chainId].find(
          (campaign) => campaign.kpiId.toLowerCase() === a.kpiId.toLowerCase()
        ) as Campaign
        const aStartDate =
          aCampaign.metrics.length > 0
            ? aCampaign.metrics.reduce((accumulator, metric) => {
                return metric.from.toSeconds() < accumulator ? metric.from.toSeconds() : accumulator
              }, Number.MAX_SAFE_INTEGER)
            : 0

        const bCampaign = CAMPAIGNS[chainId].find(
          (campaign) => campaign.kpiId.toLowerCase() === b.kpiId.toLowerCase()
        ) as Campaign
        const bStartDate =
          bCampaign.metrics.length > 0
            ? bCampaign.metrics.reduce((accumulator, metric) => {
                return metric.from.toSeconds() < accumulator ? metric.from.toSeconds() : accumulator
              }, Number.MAX_SAFE_INTEGER)
            : 0

        return bStartDate - aStartDate
      })
  }, [chainId, kpiTokens])

  const [page, setPage] = useState(1)
  const kpiTokensPage = usePage(filteredSortedKpiTokens, 6, page, 0)
  const [showUsdValues, setShowUsdValues] = useState(true)

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%">
      <Flex
        flexDirection={['column', 'row']}
        mb="28px"
        width={['100%', '65%', '55%', '50%']}
        justifyContent={['initial', 'space-between']}
        alignItems="center"
      >
        <Text fontSize="28px" fontWeight="700" mb={['16px', '0px']} mr={['0px', '24px']}>
          All campaigns
        </Text>
        <Flex alignItems="center">
          <Text mr="8px">USD values</Text>
          <Box>
            <Switch checked={showUsdValues} onChange={setShowUsdValues} />
          </Box>
        </Flex>
      </Flex>
      <Flex flexDirection="column" mb="60px" width={['100%', '65%', '55%', '50%']}>
        <Flex
          minHeight="672px"
          flexDirection={['column', 'row']}
          alignItems={['center', 'flex-start']}
          justifyContent={['center', 'center', 'center', 'flex-start']}
          width="100%"
          flexWrap="wrap"
          mb="40px"
        >
          {loadingKpiTokens || loadingKpiTokenBalances || !chainId
            ? new Array(6).fill(null).map((_, index) => {
                return (
                  <Box width={['100%', 1 / 2, 1 / 2, 1 / 3]} key={index} p="8px" maxWidth="320px">
                    <CampaignCard loading />
                  </Box>
                )
              })
            : kpiTokensPage.map((kpiToken) => {
                const campaignSpec = CAMPAIGNS[chainId].find(
                  (campaign) => campaign.kpiId.toLowerCase() === kpiToken.kpiId.toLowerCase()
                )
                if (!campaignSpec) {
                  console.warn('Could not find campaign spec by KPI id ', kpiToken.kpiId)
                  return null
                }
                const holding = kpiTokenBalances[kpiToken.address] && !kpiTokenBalances[kpiToken.address].isZero()
                return (
                  <Box width={['100%', 1 / 2, 1 / 2, 1 / 3]} key={kpiToken.kpiId} p="8px" maxWidth="320px">
                    <CampaignCard
                      kpiId={kpiToken.kpiId}
                      creator={campaignSpec.creator}
                      expiresAt={kpiToken.expiresAt}
                      goal={kpiToken.question}
                      collateral={kpiToken.collateral}
                      holding={holding}
                      usdValues={showUsdValues}
                    />
                  </Box>
                )
              })}
        </Flex>
        <Flex justifyContent="center">
          <Pagination page={page} itemsPerPage={6} onPageChange={setPage} totalItems={filteredSortedKpiTokens.length} />
        </Flex>
      </Flex>
    </Flex>
  )
}
