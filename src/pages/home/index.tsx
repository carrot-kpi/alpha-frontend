import { ReactElement } from 'react'
import { Box, Flex, Text } from 'rebass'
import styled, { useTheme } from 'styled-components'
import { CampaignCard } from '../../components/campaign-card'
import { useFeaturedKpiTokens } from '../../hooks/useFeaturedKpiTokens'
import { CREATORS_NAME_MAP, FEATURED_CAMPAIGNS } from '../../constants'
import { shortenAddress } from '../../utils'
import { ChainId } from '@carrot-kpi/sdk'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

const ImagePlaceholderBox = styled(Box)<{ size: string }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  min-width: ${(props) => props.size} !important;
  min-height: ${(props) => props.size} !important;
  background-color: ${(props) => props.theme.border};
  border-radius: 50%;
`

export function Home(): ReactElement {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()
  const { featuredKpiTokens, loading: loadingFeaturedKpiTokens } = useFeaturedKpiTokens()

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between" pt="80px" pb="80px">
        <Flex flexDirection="column" justifyContent="center">
          <Text fontSize="48px" fontWeight="700" lineHeight="50px">
            Incentivize your community.
          </Text>
          <Text mb="16px" fontSize="48px" fontWeight="700" lineHeight="64px">
            With a carrot.
          </Text>
          <Text mb="40px" fontSize="22px" fontWeight="700" lineHeight="24px" color={theme.accent}>
            Increase TVL, volume, price, engagement and more.
          </Text>
        </Flex>
        <ImagePlaceholderBox size="300px" />
      </Flex>
      <Flex flexDirection="column" alignItems="center">
        <Text fontSize="28px" fontWeight="700" mb="28px">
          Featured campaigns
        </Text>
        <Flex
          flexDirection={['column', 'row']}
          justifyContent={['flex-start', 'center']}
          alignItems={['center', 'stretch']}
          mb="60px"
          pb="20px"
          width="100%"
        >
          {loadingFeaturedKpiTokens
            ? new Array(FEATURED_CAMPAIGNS[chainId || ChainId.XDAI].length).fill(null).map((_, index) => {
                return (
                  <Box key={index} p="8px" width="100%" maxWidth={['100%', '300px']}>
                    <CampaignCard loading />
                  </Box>
                )
              })
            : featuredKpiTokens.map((featuredKpiToken) => (
                <Box key={featuredKpiToken.kpiId} p="8px" width="100%" maxWidth={['100%', '300px']}>
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
        <Flex width="80%" mb="80px" justifyContent="stretch" alignItems="center">
          <ImagePlaceholderBox size="200px" mr="40px" />
          <Flex flexDirection="column">
            <Text color={theme.accent} fontSize="28px" fontWeight="600" mb="12px">
              Lorem ipsum dolor sit amet
            </Text>
            <Box>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Box>
          </Flex>
        </Flex>
        <Flex width="80%" mb="80px" justifyContent="stretch" alignItems="center">
          <Flex flexDirection="column">
            <Text color={theme.accent} fontSize="28px" fontWeight="600" mb="12px">
              Lorem ipsum dolor sit amet
            </Text>
            <Box>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Box>
          </Flex>
          <ImagePlaceholderBox size="200px" ml="40px" />
        </Flex>
        <Flex width="80%" mb="120px" justifyContent="stretch" alignItems="center">
          <ImagePlaceholderBox size="200px" mr="40px" />
          <Flex flexDirection="column">
            <Text color={theme.accent} fontSize="28px" fontWeight="600" mb="12px">
              Lorem ipsum dolor sit amet
            </Text>
            <Box>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
