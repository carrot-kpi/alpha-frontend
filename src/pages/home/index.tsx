import { ReactElement } from 'react'
import { Box, Flex, Text } from 'rebass'
import styled, { useTheme } from 'styled-components'
import { ButtonMedium } from '../../components/button'
import { CampaignCard } from '../../components/campaign-card'
import { Footer } from '../../components/footer'
import { useFeaturedKpiTokens } from '../../hooks/useFeaturedKpiTokens'
import { CREATORS_NAME_MAP } from '../../constants'
import { Card } from '../../components/card'
import { useHistory } from 'react-router-dom'

const GrabCarrotContainer = styled(Card)`
  background: linear-gradient(97.59deg, #f8ebff 10.96%, rgba(193, 218, 214, 0.1) 48.51%, #ffd1b8 99.36%);
`

export function Home(): ReactElement {
  const theme = useTheme()
  const history = useHistory()
  const { featuredKpiTokens, loading: loadingFeaturedKpiTokens } = useFeaturedKpiTokens()

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="center" flexDirection="column">
        <Flex
          flexDirection="column"
          width={['100%', '80%', '60%', '50%']}
          alignItems="center"
          justifyContent="space-between"
          pt="100px"
          pb="40px"
        >
          <Text fontSize="48px" fontWeight="700" lineHeight="64px">
            Incentivize your community.
          </Text>
          <Text mb="8px" fontSize="48px" fontWeight="700" lineHeight="64px">
            With a carrot.
          </Text>
          <Text mb="40px" fontSize="22px" fontWeight="700" lineHeight="24px" color={theme.primaryDark}>
            Increase TVL, volume, price, engagement.
          </Text>
        </Flex>
      </Flex>
      <Flex flexDirection="column" alignItems="center" mx="-8px" pt="60px" pb="20px" id="campaigns">
        <Flex flexDirection="column" width={['100%', '80%', '60%', '50%']}>
          <Box mb="40px">
            <Text fontSize="28px" fontWeight="600">
              Featured campaigns
            </Text>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: '40px',
              gridTemplateColumns: '33% 33% 33%',
            }}
          >
            {loadingFeaturedKpiTokens
              ? new Array(3).fill(null).map((_, index) => {
                  return <CampaignCard key={index} loading />
                })
              : featuredKpiTokens.map((featuredKpiToken) => (
                  <CampaignCard
                    key={featuredKpiToken.kpiId}
                    kpiId={featuredKpiToken.kpiId}
                    creator={CREATORS_NAME_MAP[featuredKpiToken.creator] || featuredKpiToken.creator}
                    duration={featuredKpiToken.expiresAt.diffNow()}
                    goal={featuredKpiToken.question}
                    collateral={featuredKpiToken.collateral}
                    onClick={() => {
                      history.push({
                        pathname: `/campaigns/${featuredKpiToken.kpiId}`,
                        state: featuredKpiToken,
                      })
                    }}
                  />
                ))}
          </Box>
        </Flex>
      </Flex>
      <Flex flexDirection="column" alignItems="center">
        <Flex mt="100px" mb="160px" width={['100%', '80%', '60%', '50%']}>
          <GrabCarrotContainer>
            <Flex p="40px" flexDirection="column" justifyContent="center" alignItems="center">
              <Text fontSize="42px" lineHeight="50px" fontWeight="800" textAlign="center">
                Betacarotene is important.
              </Text>
              <Text fontSize="42px" lineHeight="50px" fontWeight="800" textAlign="center" mb="24px">
                Energize your community with carrots.
              </Text>
              <Box>
                <ButtonMedium>Request campaign</ButtonMedium>
              </Box>
            </Flex>
          </GrabCarrotContainer>
        </Flex>
        <Footer />
      </Flex>
    </Flex>
  )
}
