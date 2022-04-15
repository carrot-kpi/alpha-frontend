import { Box, Flex, Text } from 'rebass'
import { Button } from '../button'
import styled, { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import { Card } from '../card'
import { UndecoratedInternalLink } from '../undecorated-link'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { transparentize } from 'polished'
import { shortenAddress } from '../../utils'
import { useV1KpiToken } from '../../hooks/useV1KpiToken'
import { useV1KpiTokenBalance } from '../../hooks/useV1KpiTokenBalance'
import { Collateral } from './collateral'
import { Title } from '../title'

const HoldingBadge = styled.div`
  padding: 0 12px;
  font-size: 12px;
  height: 20px;
  background-color: ${(props) => transparentize(0.85, props.theme.positive)};
  color: ${(props) => props.theme.positive};
  border: solid 1px ${(props) => props.theme.positive};
  border-radius: 20px;
  line-height: 18px;
`

const V1Badge = styled.div`
  padding: 0 12px;
  font-size: 12px;
  height: 20px;
  background-color: ${(props) => transparentize(0.85, props.theme.accent)};
  color: ${(props) => props.theme.accent};
  border: solid 1px ${(props) => props.theme.accent};
  border-radius: 20px;
  line-height: 18px;
`

const GoalText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 28px;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  height: 112px;
`

interface CampaignCardProps {
  loading?: boolean
  address: string
  title: string
}

export function V1CampaignCard({ loading, address, title /* usdValues */ }: CampaignCardProps) {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  // const { loading: loadingCollateralPriceUSD, price: collateralPriceUSD } = useTokenPriceUSD(collateral?.currency)
  const { kpiToken, loading: loadingKpiToken } = useV1KpiToken(address)
  const { balance: kpiTokenBalance, loading: loadingKpiTokenBalance } = useV1KpiTokenBalance(kpiToken, account)

  return (
    <Card
      /* mx={['16px', '0px']} */
      flexDirection="column"
      maxWidth="320px"
      height="100%"
      display="flex"
    >
      <Flex width="100%" mb="8px" justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Text fontSize="16px" height="20px" lineHeight="16px" fontWeight="700" color={theme.accent} title="Creator">
            {shortenAddress(address)}
          </Text>
        </Flex>
        <Flex>
          <Box mr="12px">
            {!!account && (loadingKpiToken || loadingKpiTokenBalance) ? (
              <Skeleton height="20px" width="80px" />
            ) : !!account && !!kpiTokenBalance && !kpiTokenBalance.isZero() ? (
              <HoldingBadge>Holding</HoldingBadge>
            ) : null}
          </Box>
          <Box>
            <V1Badge>v1</V1Badge>
          </Box>
        </Flex>
      </Flex>
      <Box mb="20px" flexGrow={1}>
        <GoalText fontSize="20px">
          {loading || !title ? (
            <Flex flexDirection="column">
              <Box>
                <Skeleton width="100%" />
              </Box>
              <Box>
                <Skeleton width="100%" />
              </Box>
              <Box>
                <Skeleton width="100%" />
              </Box>
              <Box>
                <Skeleton width="100px" />
              </Box>
            </Flex>
          ) : (
            title
          )}
        </GoalText>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4px">
        <Title mr="16px">Rewards:</Title>
        <Text textAlign="right" fontSize="14px" fontFamily="Overpass Mono" fontWeight="700">
          {loading || !kpiToken ? <Skeleton width="100px" /> : <Collateral data={kpiToken.data} />}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Title>Conditions:</Title>
        {!kpiToken ? (
          <Skeleton height="12px" width="80px" />
        ) : (
          <Text fontFamily="Overpass Mono" fontSize="14px" fontWeight="600">
            {kpiToken.oracles.length}
          </Text>
        )}
      </Flex>
      <Box>
        <UndecoratedInternalLink to={`/v1/campaigns/${address}`}>
          <Button primary medium disabled={loading}>
            See campaign
          </Button>
        </UndecoratedInternalLink>
      </Box>
    </Card>
  )
}
