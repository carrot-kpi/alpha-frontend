import { ReactElement, useLayoutEffect, useState } from 'react'
import { Box, Flex, Text, Image } from 'rebass'
import styled, { useTheme } from 'styled-components'
import { CampaignCard } from '../../components/campaign-card'
import { useFeaturedKpiTokens } from '../../hooks/useFeaturedKpiTokens'
import { CREATORS_NAME_MAP } from '../../constants'
import { shortenAddress } from '../../utils'
import { ChainId } from '@carrot-kpi/sdk'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { FEATURED_CAMPAIGNS } from '../../constants/featured-campaigns'
import heroImage from '../../assets/hero.png'
import measureImage from '../../assets/measure.png'
import incentivizeImage from '../../assets/incentivize.png'
import rewardImage from '../../assets/reward.png'
import { Card } from '../../components/card'
import { transparentize } from 'polished'
import Slider from 'react-slick'
import { useIsMobile } from '../../hooks/useIsMobile'
import useMedia from 'react-use/lib/useMedia'

const FeaturedCampaignsContainer = styled(Card)`
  border: none;
  border-radius: 0px !important;
  width: 100%;
  background-color: ${(props) => transparentize(0.9, props.theme.accent)};
`

const StyledSlider = styled(Slider)`
  width: 100%;
`

export function Home(): ReactElement {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()
  const { featuredKpiTokens, loading: loadingFeaturedKpiTokens } = useFeaturedKpiTokens()
  const [slidesToShow, setSlidesToShow] = useState(3)
  const mobile = useIsMobile()
  const tablet = useMedia(`(max-width: 1024px)`)

  useLayoutEffect(() => {
    if (mobile) setSlidesToShow(1)
    else if (tablet) setSlidesToShow(2)
    else setSlidesToShow(3)
  }, [tablet, mobile])

  return (
    <Flex flexDirection="column" alignItems="center">
      <Flex
        justifyContent={['flex-start', 'flex-start', 'space-between']}
        alignItems="center"
        flexDirection={['column-reverse', 'column-reverse', 'row']}
        pt={['8px', '8px', '60px']}
        pb={['16px', '16px', '90px']}
        width={['100%', '80%', '70%', '55%']}
      >
        <Flex flexDirection="column" justifyContent="center" pr={['auto', 'auto', '24px']} px={['12px', 'auto']}>
          <Text
            key="title-incentivize"
            fontSize={['44px', '52px']}
            fontWeight="800"
            lineHeight={['50px', '50px']}
            textAlign={['center', 'center', 'initial']}
          >
            Reach your goals.
          </Text>
          <Text
            key="title-carrot"
            mb="16px"
            fontSize={['44px', '52px']}
            fontWeight="800"
            lineHeight={['50px', '64px']}
            textAlign={['center', 'center', 'initial']}
          >
            With a carrot.
          </Text>
          <Text
            key="title-more"
            mb={['40px', '40px', '0px']}
            fontSize={['20px', '22px']}
            fontWeight="800"
            lineHeight="24px"
            textAlign={['center', 'center', 'initial']}
            color={theme.accent}
          >
            Increase TVL, volume, price, engagement and more.
          </Text>
        </Flex>
        <Image
          src={heroImage}
          alt="Hero image"
          height={['auto', 'auto', '200px', '360px']}
          width={['80%', '70%', '200px', '360px']}
          mb={['40px', '40px', '0px']}
          minWidth="auto"
        />
      </Flex>
      <FeaturedCampaignsContainer mb="120px" pt="60px" pb="100px" flexDirection="column" alignItems="center">
        <Text fontSize="28px" fontWeight="700" mb="28px" textAlign="center">
          Featured campaigns
        </Text>
        <Flex width="100%" justifyContent="center">
          <Box width={['100%', '80%', '70%', '55%']} px="16px">
            <StyledSlider dots infinite={false} slidesToShow={slidesToShow}>
              {loadingFeaturedKpiTokens
                ? new Array(FEATURED_CAMPAIGNS[chainId || ChainId.XDAI].length).fill(null).map((_, index) => {
                    return (
                      <Box key={index} width="100%" p="8px" maxWidth={['100%', '320px']}>
                        <CampaignCard loading />
                      </Box>
                    )
                  })
                : featuredKpiTokens.map((featuredKpiToken) => (
                    <Box key={featuredKpiToken.kpiId} width="100%" p="8px" maxWidth={['100%', '320px']}>
                      <CampaignCard
                        kpiId={featuredKpiToken.kpiId}
                        creator={
                          CREATORS_NAME_MAP[featuredKpiToken.creator] || shortenAddress(featuredKpiToken.creator)
                        }
                        expiresAt={featuredKpiToken.expiresAt}
                        goal={featuredKpiToken.question}
                        collateral={featuredKpiToken.collateral}
                      />
                    </Box>
                  ))}
            </StyledSlider>
          </Box>
        </Flex>
      </FeaturedCampaignsContainer>
      <Flex width={['100%', '80%', '70%', '55%']} flexDirection="column" alignItems="center">
        <Flex
          alignSelf={['initial', 'initial', 'flex-start']}
          width="80%"
          mb="80px"
          flexDirection={['column', 'column', 'row']}
          justifyContent="stretch"
          alignItems="center"
        >
          <Image
            src={measureImage}
            height="200px"
            mr={['0px', '0px', '32px']}
            mb={['16px', '16px', '0px']}
            width="auto"
            minWidth="auto"
          />
          <Flex flexDirection="column">
            <Text
              color={theme.accent}
              fontSize="28px"
              fontWeight="600"
              mb="12px"
              textAlign={['center', 'center', 'initial']}
            >
              Measure what matters
            </Text>
            <Text textAlign={['center', 'center', 'initial']}>
              With Carrot you can define specific goals and targets based on what <strong>your</strong> project really
              needs. Coordinate your community to reach common goals leveraging strong cryptoeconomic incentives.
            </Text>
          </Flex>
        </Flex>
        <Flex
          alignSelf={['initial', 'initial', 'flex-start']}
          flexDirection={['column-reverse', 'column-reverse', 'row']}
          width="80%"
          mb="80px"
          justifyContent="stretch"
          alignItems="center"
        >
          <Flex flexDirection="column">
            <Text
              color={theme.accent}
              fontSize="28px"
              fontWeight="600"
              mb="12px"
              textAlign={['center', 'center', 'initial']}
            >
              Incentivize your community
            </Text>
            <Text textAlign={['center', 'center', 'initial']}>
              Promote positive feedback in your community by rewarding users when important milestones and goals are
              reached through a collective effort. Just come up with a goal that fits your project and let Carrot do the
              rest.
            </Text>
          </Flex>
          <Image
            src={incentivizeImage}
            height="200px"
            ml={['0px', '0px', '12px']}
            mb={['16px', '16px', '0px']}
            width="auto"
            minWidth="auto"
          />
        </Flex>
        <Flex
          alignSelf={['initial', 'initial', 'flex-start']}
          flexDirection={['column', 'column', 'row']}
          width="80%"
          mb="120px"
          justifyContent="stretch"
          alignItems="center"
        >
          <Image
            src={rewardImage}
            height="200px"
            mr={['0px', '0px', '32px']}
            mb={['16px', '16px', '0px']}
            width="auto"
            minWidth="auto"
          />
          <Flex flexDirection="column">
            <Text
              color={theme.accent}
              fontSize="28px"
              fontWeight="600"
              mb="12px"
              textAlign={['center', 'center', 'initial']}
            >
              Reward the community
            </Text>
            <Text textAlign={['center', 'center', 'initial']}>
              Through the power of KPI tokens, anyone effectively contributing to a goal can receive a reward directly
              proportional to their impact. Get real value in exchange for real value.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
