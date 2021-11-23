import { Box, Flex, Text } from 'rebass'
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

const KpiExpiredText = styled(Text)`
  color: ${(props) => props.theme.negativeSurfaceContent};
`

const GoalText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  height: 108px;
`

interface CampaignCardProps {
  loading?: boolean
  kpiId?: string
  creator?: string
  expiresAt?: DateTime
  goal?: string
  collateral?: Amount<Token>
}

export function CampaignCard({ loading, kpiId, creator, expiresAt, goal, collateral }: CampaignCardProps) {
  const theme = useTheme()
  const { loading: loadingCollateralPriceUSD, price: collateralPriceUSD } = useTokenPriceUSD(collateral?.currency)
  const [question, setQuestion] = useState('')

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
      mx={['16px', '0px']}
      flexDirection="column"
      width="100%"
      maxWidth={['auto', '320px']}
      height="100%"
      display="flex"
    >
      <Text fontSize="16px" mb="8px" fontWeight="700" color={theme.accent}>
        {loading ? <Skeleton width="40px" /> : creator}
      </Text>
      <Box mb="20px" flexGrow={1}>
        <GoalText fontSize="20px">
          {loading || !goal ? (
            <Flex flexDirection="column">
              <Box mb="8px">
                <Skeleton width="100%" />
              </Box>
              <Box mb="8px">
                <Skeleton width="100%" />
              </Box>
              <Box mb="8px">
                <Skeleton width="100px" />
              </Box>
            </Flex>
          ) : (
            question
          )}
        </GoalText>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4px">
        <Title>Rewards:</Title>
        <Text textAlign="right" fontFamily="Overpass Mono" fontWeight="700">
          {loading || !collateral || loadingCollateralPriceUSD ? (
            <Skeleton width="100px" />
          ) : (
            `${collateral?.toFixed(4)} ${collateral?.currency.symbol} ($${
              collateralPriceUSD.isZero() ? '-' : collateral.multiply(collateralPriceUSD).toFixed(2)
            })`
          )}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Title>Time left:</Title>
        {!expiresAt ? (
          <Skeleton width="80px" />
        ) : expiresAt.toJSDate().getTime() < Date.now() ? (
          <KpiExpiredText fontFamily="Overpass Mono" textAlign="right" fontWeight="700">
            KPI expired
          </KpiExpiredText>
        ) : (
          <Countdown fontSize="14px" fontWeight="600" to={expiresAt} />
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
