import { ReactElement } from 'react'
import { Box, Flex, Text } from 'rebass'
import styled, { useTheme } from 'styled-components'
import heroImage from '../../assets/hero.png'
import { ButtonMedium } from '../../components/button'
import logo from '../../assets/logo.svg'
import { CampaignCard } from '../../components/campaign-card'
import { ExplanationSection } from '../../components/home/explanation-section'
import { SmoothScrollLink } from '../../components/smooth-scroll-link'
import { UndecoratedLink } from '../../components/undecorated-link'
import { useFeaturedKpiTokens } from '../../hooks/useFeaturedKpiTokens'
import { CREATORS_NAME_MAP } from '../../constants'

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

const ExplanationSectionLogoPlaceholder = styled.div`
  border-radius: 50%;
  height: 74px;
  width: 74px;
  background: ${(props) => props.theme.divider};
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
  const { featuredKpiTokens } = useFeaturedKpiTokens()

  return (
    <Flex flexDirection="column">
      <RootContainer alignItems="center" justifyContent="center" flexDirection="column">
        <Flex width={['100%', '80%', '60%']} alignItems="center" justifyContent="space-between" py="160px">
          <Flex flexDirection="column" pr="120px">
            <Text mb="40px" fontSize="64px" fontWeight="800" lineHeight="64px">
              Incentivize your community with a carrot
            </Text>
            <Text mb="40px" fontSize="22px" fontWeight="800" lineHeight="24px" color={theme.primaryDark}>
              Increase TVL, volume, price, engagement and more.
            </Text>
            <Box>
              <SmoothScrollLink smooth="easeInOutQuint" to="campaigns">
                <ButtonMedium width="fit-content">See campaigns</ButtonMedium>
              </SmoothScrollLink>
            </Box>
          </Flex>
          <Box minWidth="auto">
            <HeroLogoBack>
              <HeroLogo src={heroImage} alt="hero" />
            </HeroLogoBack>
          </Box>
        </Flex>
        <Box
          mb="80px"
          width={['100%', '80%', '60%']}
          sx={{
            display: 'grid',
            gridGap: '120px',
            gridTemplateColumns: 'auto auto auto',
          }}
        >
          <ExplanationSection image={<ExplanationSectionLogoPlaceholder />} title="Lorem ipsum">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text.
          </ExplanationSection>
          <ExplanationSection image={<ExplanationSectionLogoPlaceholder />} title="Lorem ipsum">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text.
          </ExplanationSection>
          <ExplanationSection image={<ExplanationSectionLogoPlaceholder />} title="Lorem ipsum">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text.
          </ExplanationSection>
        </Box>
      </RootContainer>
      <CampaignsContainer flexDirection="column" alignItems="center" mx="-8px" py="120px" id="campaigns">
        <Flex flexDirection="column" width={['100%', '80%', '60%']}>
          <Box mb="60px">
            <Text fontSize="36px" lineHeight="64px" fontWeight="800">
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
            <Box>
              {featuredKpiTokens.map((featuredKpiToken) => (
                <CampaignCard
                  key={featuredKpiToken.kpiId}
                  creator={CREATORS_NAME_MAP[featuredKpiToken.creator] || featuredKpiToken.creator}
                  duration={featuredKpiToken.expiresAt.diffNow()}
                  goal={featuredKpiToken.question}
                  collateral={featuredKpiToken.collateral}
                  progress={0.4}
                  lowerBound={0}
                  higherBound={300}
                />
              ))}
            </Box>
          </Box>
        </Flex>
      </CampaignsContainer>
      <BottomSectionContainer flexDirection="column" alignItems="center">
        <GrabCarrotContainer
          mt="200px"
          mb="260px"
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
              <UndecoratedLink href="https://discord.com/invite/4QXEJQkvHH" target="_blank" rel="noreferrer noopener">
                <Text fontSize="17px" fontWeight="400">
                  Discord
                </Text>
              </UndecoratedLink>
            </Box>
            <Box mr="40px">
              <UndecoratedLink href="https://daotalk.org/c/dx-dao/15" target="_blank" rel="noreferrer noopener">
                <Text fontSize="17px" fontWeight="400">
                  Forum
                </Text>
              </UndecoratedLink>
            </Box>
          </Flex>
        </Flex>
      </BottomSectionContainer>
    </Flex>
  )
}
