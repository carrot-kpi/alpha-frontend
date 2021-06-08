import { ReactElement } from 'react'
import { Box, Flex, Text } from 'rebass'
import { useTheme } from 'styled-components'
import { CampaignCard } from '../../components/campaign-card'
import { useFeaturedKpiTokens } from '../../hooks/useFeaturedKpiTokens'
import { CREATORS_NAME_MAP, FEATURED_KPI_TOKENS } from '../../constants'
import { useHistory } from 'react-router-dom'

export function Home(): ReactElement {
  const theme = useTheme()
  const history = useHistory()
  const { featuredKpiTokens, loading: loadingFeaturedKpiTokens } = useFeaturedKpiTokens()

  return (
    <Flex flexDirection="column" id="asddsaasddsa">
      <Flex alignItems="center" justifyContent="center" flexDirection="column">
        <Flex flexDirection="column" alignItems="center" justifyContent="space-between" pt="60px" pb="60px">
          <Text fontSize="48px" fontWeight="700" lineHeight="64px">
            Incentivize your community.
          </Text>
          <Text mb="8px" fontSize="48px" fontWeight="700" lineHeight="64px">
            With a carrot.
          </Text>
          <Text mb="40px" fontSize="22px" fontWeight="700" lineHeight="24px" color={theme.primary}>
            Increase TVL, volume, price, engagement and more.
          </Text>
        </Flex>
      </Flex>
      <Flex flexDirection="column" alignItems="center" mx="-8px" pb="20px">
        <Flex justifyContent="center" mb="60px" width="100%">
          {loadingFeaturedKpiTokens
            ? new Array(FEATURED_KPI_TOKENS.length).fill(null).map((_, index) => {
                return (
                  <Box key={index} p="8px" width="100%" maxWidth="300px">
                    <CampaignCard loading />
                  </Box>
                )
              })
            : featuredKpiTokens.map((featuredKpiToken) => (
                <Box key={featuredKpiToken.kpiId} p="8px" width="100%" maxWidth="300px">
                  <CampaignCard
                    kpiId={featuredKpiToken.kpiId}
                    creator={CREATORS_NAME_MAP[featuredKpiToken.creator] || featuredKpiToken.creator}
                    expiresAt={featuredKpiToken.expiresAt}
                    goal={featuredKpiToken.question}
                    collateral={featuredKpiToken.collateral}
                    onClick={() => {
                      history.push({
                        pathname: `/campaigns/${featuredKpiToken.kpiId}`,
                        state: featuredKpiToken,
                      })
                    }}
                  />
                </Box>
              ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
