import { KpiToken } from '@carrot-kpi/alpha-sdk'
import { KpiToken as V1KpiToken } from '@carrot-kpi/v1-sdk'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { Box, Flex, Text } from 'rebass'
import { CampaignCard } from '../../components/campaign-card'
import { Switch } from '../../components/switch'
import { V1CampaignCard } from '../../components/v1-campaign-card'
import { FEATURED_CAMPAIGNS } from '../../constants/featured-campaigns'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useFeaturedKpiTokens } from '../../hooks/useFeaturedKpiTokens'
import { useV1KpiTokens } from '../../hooks/useV1KpiTokens'

export function Campaigns(): ReactElement {
  const { chainId } = useActiveWeb3React()
  const { featuredKpiTokens, loading: loadingFeaturedKpiTokens } = useFeaturedKpiTokens()
  const { loading: loadingV1KpiTokens, kpiTokens: v1KpiTokens } = useV1KpiTokens()
  const [showUsdValues, setShowUsdValues] = useState(true)

  const [allKpiTokens, setAllKpiTokens] = useState<(KpiToken | V1KpiToken)[]>([])

  useEffect(() => {
    if (
      loadingV1KpiTokens ||
      loadingFeaturedKpiTokens ||
      !v1KpiTokens ||
      !featuredKpiTokens ||
      featuredKpiTokens.length + v1KpiTokens.length == 0
    ) {
      setAllKpiTokens([])
      return
    }
    setAllKpiTokens([...v1KpiTokens, ...featuredKpiTokens])
  }, [featuredKpiTokens, loadingFeaturedKpiTokens, loadingV1KpiTokens, v1KpiTokens])

  const handleSwitchChange = useCallback((newValue: boolean) => {
    setShowUsdValues(newValue)
  }, [])

  return (
    <Flex flexDirection="column" alignItems="center">
      <Flex width={['100%', '80%', '70%', '55%']} justifyContent="space-between">
        <Text fontSize="28px" fontWeight="700" mb={['16px', '0px']} mr={['0px', '24px']}>
          Campaigns
        </Text>
        <Flex alignItems="center">
          <Text mr="8px">USD values</Text>
          <Box>
            <Switch checked={showUsdValues} onChange={handleSwitchChange} />
          </Box>
        </Flex>
      </Flex>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%">
        <Flex
          justifyContent={['flex-start', 'flex-start', 'space-between']}
          alignItems="center"
          flexDirection={['column-reverse', 'column-reverse', 'row']}
          pt={['8px', '8px', '60px']}
          pb={['16px', '16px', '90px']}
          width={['100%', '80%', '70%', '55%']}
        >
          <Flex width="100%" px={['16px', '0px']} flexDirection={['column', 'row']} alignItems="center" flexWrap="wrap">
            {loadingFeaturedKpiTokens || loadingV1KpiTokens || !chainId
              ? new Array(9).fill(null).map((_, index) => {
                  return (
                    <Box key={index} width="100%" p="8px" maxWidth={['100%', '320px']}>
                      <CampaignCard loading />
                    </Box>
                  )
                })
              : allKpiTokens.map((kpiToken) => {
                  if (kpiToken instanceof KpiToken) {
                    const featuredCampaignSpec = FEATURED_CAMPAIGNS[chainId].find(
                      (campaign) => campaign.kpiId === kpiToken.kpiId
                    )
                    if (!featuredCampaignSpec) {
                      console.warn('Could not find featured campaign with KPI id ', kpiToken.kpiId)
                      return null
                    }
                    return (
                      <Box key={kpiToken.address} width="100%" p="8px" maxWidth="320px">
                        <CampaignCard
                          address={kpiToken.address}
                          creator={featuredCampaignSpec.creator}
                          expiresAt={kpiToken.expiresAt}
                          goal={kpiToken.question}
                          collateral={kpiToken.collateral}
                          usdValues={showUsdValues}
                        />
                      </Box>
                    )
                  } else if (kpiToken instanceof V1KpiToken) {
                    return (
                      <Box key={kpiToken.address} width="100%" p="8px" maxWidth="320px">
                        <V1CampaignCard address={kpiToken.address} title={kpiToken.description.title} />
                      </Box>
                    )
                  } else return null
                })}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
