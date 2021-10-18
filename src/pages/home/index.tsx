import { ReactElement, useLayoutEffect, useMemo } from 'react'
import { Box, Flex, Text } from 'rebass'
import styled, { useTheme } from 'styled-components'
import { CampaignCard } from '../../components/campaign-card'
import { useFeaturedKpiTokens } from '../../hooks/useFeaturedKpiTokens'
import { CREATORS_NAME_MAP } from '../../constants'
import { shortenAddress } from '../../utils'
import { ChainId } from '@carrot-kpi/sdk'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { transparentize } from 'polished'
import { animated, useTrail } from '@react-spring/web'
import { FEATURED_CAMPAIGNS } from '../../constants/featured-campaigns'
import heroImage from '../../assets/hero.png'
import measureImage from '../../assets/measure.png'
import incentivizeImage from '../../assets/incentivize.png'
import rewardImage from '../../assets/reward.png'

const FeaturedCampaignsContainer = styled(Flex)`
  background-color: ${(props) => transparentize(0.9, props.theme.accent)};
  box-shadow: 0px 12px 12px -6px ${(props) => transparentize(0.9, props.theme.accent)} inset,
    0px -6px 12px 2px ${(props) => transparentize(0.9, props.theme.accent)} inset;
`

export function Home(): ReactElement {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()
  const { featuredKpiTokens, loading: loadingFeaturedKpiTokens } = useFeaturedKpiTokens()
  const titleItems = useMemo(
    () => [
      <Text key="title-incentivize" fontSize="52px" fontWeight="800" lineHeight="50px">
        Reach your goals.
      </Text>,
      <Text key="title-carrot" mb="16px" fontSize="52px" fontWeight="800" lineHeight="64px">
        With a carrot.
      </Text>,
      <Text key="title-more" mb="40px" fontSize="22px" fontWeight="800" lineHeight="24px" color={theme.accent}>
        Increase TVL, volume, price, engagement and more.
      </Text>,
    ],
    [theme.accent]
  )
  const [trail, api] = useTrail(titleItems.length, () => ({
    opacity: 0,
    x: 24,
    config: { mass: 1, tension: 200, friction: 200, duration: 200 },
  }))

  useLayoutEffect(() => {
    api.start({ opacity: 1, x: 0 })
  })

  return (
    <Flex flexDirection="column" alignItems="center">
      <Flex justifyContent="space-between" pt="60px" pb="90px" width={['100%', '80%', '60%', '55%', '40%']}>
        <Flex flexDirection="column" justifyContent="center">
          {trail.map((style, index) => {
            return (
              <animated.div key={index} style={style}>
                {titleItems[index]}
              </animated.div>
            )
          })}
        </Flex>
        <img src={heroImage} alt="Hero image" height="300px" />
      </Flex>
      <FeaturedCampaignsContainer width="100%" mb="60px" py="60px" flexDirection="column" alignItems="center">
        <Text fontSize="28px" fontWeight="700" mb="28px">
          Featured campaigns
        </Text>
        <Flex
          flexDirection={['column', 'row']}
          justifyContent={['flex-start', 'center']}
          alignItems={['center', 'stretch']}
          width="100%"
        >
          {loadingFeaturedKpiTokens
            ? new Array(FEATURED_CAMPAIGNS[chainId || ChainId.XDAI].length).fill(null).map((_, index) => {
                return (
                  <Box key={index} p="8px" width="100%" maxWidth={['100%', '320px']}>
                    <CampaignCard loading />
                  </Box>
                )
              })
            : featuredKpiTokens.map((featuredKpiToken) => (
                <Box key={featuredKpiToken.kpiId} p="8px" width="100%" maxWidth={['100%', '320px']}>
                  <CampaignCard
                    kpiId={featuredKpiToken.kpiId}
                    creator={CREATORS_NAME_MAP[featuredKpiToken.creator] || shortenAddress(featuredKpiToken.creator)}
                    expiresAt={featuredKpiToken.expiresAt}
                    goal={featuredKpiToken.question}
                    collateral={featuredKpiToken.collateral}
                  />
                </Box>
              ))}
        </Flex>
      </FeaturedCampaignsContainer>
      <Flex width={['100%', '80%', '60%', '60%', '40%']} flexDirection="column" alignItems="center">
        <Flex width="80%" mb="80px" justifyContent="stretch" alignItems="center">
          <Box height="200px" mr="40px" minWidth="auto">
            <img src={measureImage} height="100%" width="auto" />
          </Box>
          <Flex flexDirection="column">
            <Text color={theme.accent} fontSize="28px" fontWeight="600" mb="12px">
              Measure what matters
            </Text>
            <Box>
              With Carrot you can define specific goals and targets based on what <strong>your</strong> project really
              needs. Coordinate your community to reach common goals leveraging strong cryptoeconomic incentives.
            </Box>
          </Flex>
        </Flex>
        <Flex width="80%" mb="80px" justifyContent="stretch" alignItems="center">
          <Flex flexDirection="column">
            <Text color={theme.accent} fontSize="28px" fontWeight="600" mb="12px">
              Incentivize your community
            </Text>
            <Box>
              Promote positive feedback in your community by rewarding users when important milestones and goals are
              reached through a collective effort. Just come up with a goal that fits your project and let Carrot do the
              rest.
            </Box>
          </Flex>
          <Box height="200px" ml="40px" minWidth="auto">
            <img src={incentivizeImage} height="100%" width="auto" />
          </Box>
        </Flex>
        <Flex width="80%" mb="120px" justifyContent="stretch" alignItems="center">
          <Box height="200px" mr="40px" minWidth="auto">
            <img src={rewardImage} height="100%" width="auto" />
          </Box>
          <Flex flexDirection="column">
            <Text color={theme.accent} fontSize="28px" fontWeight="600" mb="12px">
              Reward the community
            </Text>
            <Box>
              Through the power of KPI tokens, anyone effectively contributing to a goal can receive a reward directly
              proportional to their impact. Get real value in exchange for real value.
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
