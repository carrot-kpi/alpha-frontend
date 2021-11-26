import { Box, Flex, Image, Text } from 'rebass'
import { DateTime } from 'luxon'
import { Button } from '../button'
import styled, { useTheme } from 'styled-components'
import { Amount, Token } from '@carrot-kpi/sdk'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
import Skeleton from 'react-loading-skeleton'
import { Card } from '../card'
import { Countdown } from '../countdown'
import { UndecoratedInternalLink } from '../undecorated-link'
import { Title } from '../title'
import { useEffect, useState } from 'react'
import { remark } from 'remark'
import strip from 'strip-markdown'
import { useKpiToken } from '../../hooks/useKpiToken'
import { useKpiTokenBalance } from '../../hooks/useKpiTokenBalance'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { transparentize } from 'polished'
import { Creator } from '../../constants/creators'

const KpiExpiredText = styled(Text)`
  color: ${(props) => props.theme.negativeSurfaceContent};
`

const HoldingBadge = styled.div`
  padding: 0 12px;
  font-size: 12px;
  height: 20px;
  background-color: ${(props) => transparentize(0.85, props.theme.positive)};
  color: ${(props) => props.theme.positive};
  border: solid 1px ${(props) => props.theme.positive};
  border-radius: 20px;
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
  kpiId?: string
  creator?: Creator
  expiresAt?: DateTime
  goal?: string
  collateral?: Amount<Token>
}

export function CampaignCard({ loading, kpiId, creator, expiresAt, goal, collateral }: CampaignCardProps) {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const { loading: loadingCollateralPriceUSD, price: collateralPriceUSD } = useTokenPriceUSD(collateral?.currency)
  const [question, setQuestion] = useState('')
  const { kpiToken, loading: loadingKpiToken } = useKpiToken(kpiId ? kpiId : '')
  const { balance: kpiTokenBalance, loading: loadingKpiTokenBalance } = useKpiTokenBalance(kpiToken, account)

  useEffect(() => {
    let cancelled = false
    const stripMarkdown = async () => {
      if (!goal) return
      try {
        const file = await remark().use(strip).process(goal)
        const content = file?.toString()
        if (content && !cancelled) setQuestion(content)
      } catch (error) {
        console.error('error stripping markdown', error)
      }
    }
    stripMarkdown()
    return () => {
      cancelled = false
    }
  }, [goal])

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
          <Box mr="6px">
            {loading || loadingKpiToken || !kpiToken || !creator ? (
              <Skeleton circle width="16px" height="16px" />
            ) : (
              <Image width="16px" height="16px" src={creator.logo} />
            )}
          </Box>
          <Text fontSize="16px" height="20px" lineHeight="16px" fontWeight="700" color={theme.accent} title="Creator">
            {loadingKpiToken || !kpiToken || !creator ? <Skeleton width="60px" /> : creator.name}
          </Text>
        </Flex>
        {!!account && (loadingKpiToken || loadingKpiTokenBalance) ? (
          <Skeleton height="20px" width="80px" />
        ) : !!account && !!kpiTokenBalance && !kpiTokenBalance.isZero() ? (
          <HoldingBadge>Holding</HoldingBadge>
        ) : null}
      </Flex>
      <Box mb="20px" flexGrow={1}>
        <GoalText fontSize="20px">
          {loading || !goal ? (
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
            question
          )}
        </GoalText>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4px">
        <Title mr="16px">Rewards:</Title>
        <Text fontSize="12px" textAlign="right" fontFamily="Overpass Mono" fontWeight="700">
          {loading || !collateral || loadingCollateralPriceUSD ? (
            <Skeleton width="100px" />
          ) : (
            `${collateral?.toFixed(2)} ${collateral?.currency.symbol} ($${
              collateralPriceUSD.isZero() ? '-' : collateral.multiply(collateralPriceUSD).toFixed(2)
            })`
          )}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Title>Time left:</Title>
        {!expiresAt ? (
          <Skeleton height="12px" width="80px" />
        ) : expiresAt.toJSDate().getTime() < Date.now() ? (
          <KpiExpiredText fontSize="12px" fontFamily="Overpass Mono" textAlign="right" fontWeight="700">
            KPI expired
          </KpiExpiredText>
        ) : (
          <Countdown fontSize="12px" fontWeight="600" to={expiresAt} />
        )}
      </Flex>
      <Box>
        <UndecoratedInternalLink to={`/campaigns/${kpiId}`}>
          <Button primary medium disabled={loading}>
            See campaign
          </Button>
        </UndecoratedInternalLink>
      </Box>
    </Card>
  )
}
