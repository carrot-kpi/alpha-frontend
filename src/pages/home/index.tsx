import { ReactElement } from 'react'
import { Box, Flex, Text } from 'rebass'
import styled, { useTheme } from 'styled-components'
import heroImage from '../../assets/hero.png'
import { ButtonMedium } from '../../components/button'
import logo from '../../assets/logo.svg'
import { CampaignCard } from '../../components/campaign-card'
import { Duration } from 'luxon'
import { animated, useTrail, config } from '@react-spring/web'

const RootContainer = styled(Flex)`
  position: relative;
  background-image: radial-gradient(circle at bottom, ${(props) => props.theme.white} 50%, rgba(255, 255, 255, 0) 90%),
    linear-gradient(180deg, ${(props) => props.theme.primary3} 49.35%, rgba(255, 255, 255, 0) 119.9%);
`

const HeroLogo = styled.img`
  width: 400px;
  height: 400px;
  position: absolute;
`

const HeroLogoBack = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: linear-gradient(180deg, ${(props) => props.theme.primary1} 0%, rgba(0, 0, 0, 0) 100%);
`

const GrabCarrotContainer = styled(Flex)`
  border-radius: 48px;
  background: linear-gradient(97.59deg, #f8ebff 0.96%, rgba(193, 218, 214, 0.08) 48.51%, #ffd1b8 99.36%);
  box-shadow: 0px 45px 80px rgba(255, 163, 112, 0.2);
`

const CampaignsContainer = styled(Flex)`
  background-color: #fff6f3;
`

const BottomSectionContainer = styled(Flex)`
  background: linear-gradient(360deg, rgba(250, 168, 122, 0.12) 0%, rgba(250, 168, 122, 0) 93.36%);
`

const Logo = styled.img`
  height: 20px;
`

export function Home(): ReactElement {
  const theme = useTheme()
  const [fadeInAnimations] = useTrail(4, () => ({
    from: { opacity: 0, y: 8 },
    to: { opacity: 1, y: 0 },
    config: { ...config.default, duration: 200 },
  }))

  return (
    <Flex flexDirection="column">
      <RootContainer alignItems="center" justifyContent="center" flexDirection="column" minHeight="80vh">
        <Flex width={['100%', '80%', '60%']} alignItems="center" justifyContent="space-between" mb="80px">
          <Flex flexDirection="column" pr="120px">
            <animated.div style={fadeInAnimations[0]}>
              <Text mb="20px" fontSize="64px" lineHeight="68px" fontWeight="800">
                Incentivize your community with a carrot
              </Text>
            </animated.div>
            <animated.div style={fadeInAnimations[1]}>
              <Text mb="40px" fontSize="22px" fontWeight="800" lineHeight="24px" color={theme.primaryDark}>
                Increase TVL, volume, price, engagement and more.
              </Text>
            </animated.div>
            <animated.div style={fadeInAnimations[2]}>
              <ButtonMedium width="fit-content">See campaigns</ButtonMedium>
            </animated.div>
          </Flex>
          <Box minWidth="auto">
            <animated.div style={fadeInAnimations[3]}>
              <HeroLogoBack>
                <HeroLogo src={heroImage} alt="hero" />
              </HeroLogoBack>
            </animated.div>
          </Box>
        </Flex>
      </RootContainer>
      <CampaignsContainer flexDirection="column" alignItems="center" mx="-8px" py="120px">
        <Flex flexDirection="column" width={['100%', '80%', '60%']}>
          <Box mb="60px">
            <Text fontSize="36px" lineHeight="64px" fontWeight="800">
              Featured campaigns
            </Text>
          </Box>
          <Flex justifyContent="space-between">
            {new Array(3).fill(null).map((_, i) => (
              <Box key={i}>
                <CampaignCard
                  creator="DXdao"
                  duration={Duration.fromObject({ days: 2 })}
                  goal="Goal"
                  rewardsUSD={12345}
                />
              </Box>
            ))}
          </Flex>
        </Flex>
      </CampaignsContainer>
      <BottomSectionContainer flexDirection="column" alignItems="center">
        <GrabCarrotContainer
          my="200px"
          p="84px"
          flexDirection="column"
          width={['100%', '80%', '60%']}
          justifyContent="center"
          alignItems="center"
        >
          <Box width={['90%', '70%', '70%']} mb="28px">
            <Text fontSize="42px" lineHeight="50px" fontWeight="800" textAlign="center">
              Betacarotene is important. Energize your community with carrots.
            </Text>
          </Box>
          <Box>
            <ButtonMedium>Request campaign</ButtonMedium>
          </Box>
        </GrabCarrotContainer>
        <Flex mb="60px" width={['100%', '80%', '60%']} justifyContent="space-between">
          <Flex>
            <Box mr="40px">
              <Logo src={logo} alt="logo" />
            </Box>
            <Box mr="40px">
              <Text fontSize="17px" fontWeight="400">
                © {new Date().getFullYear()} DXdao
              </Text>
            </Box>
          </Flex>
          <Flex>
            <Box mr="40px">
              <Text fontSize="17px" fontWeight="400">
                About
              </Text>
            </Box>
            <Box mr="40px">
              <Text fontSize="17px" fontWeight="400">
                Discord
              </Text>
            </Box>
            <Box mr="40px">
              <Text fontSize="17px" fontWeight="400">
                Forum
              </Text>
            </Box>
          </Flex>
        </Flex>
      </BottomSectionContainer>
    </Flex>
  )
}
