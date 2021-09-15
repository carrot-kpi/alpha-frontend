import { Box, Flex, Text } from 'rebass'
import { DateTime } from 'luxon'
import { ButtonMedium } from '../button'
import styled, { useTheme } from 'styled-components'
import { Amount } from '@carrot-kpi/sdk'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
import Skeleton from 'react-loading-skeleton'
import { Card } from '../card'
import { Countdown } from '../countdown'
import { Token } from '@usedapp/core'
import { UndecoratedInternalLink } from '../undecorated-link'

const KpiExpiredText = styled(Text)`
  color: ${(props) => props.theme.error};
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
  const { priceUSD: collateralPriceUSD } = useTokenPriceUSD(collateral?.currency)

  return (
    <Card
      mx={['16px', '0px']}
      flexDirection="column"
      maxWidth={['auto', '300px']}
      height="100%"
      display="flex"
    >
      <Flex width="100%" justifyContent="space-between" mb="16px">
        <Text fontSize="20px" fontWeight="700" lineHeight="30px" color={theme.primary}>
          {loading ? <Skeleton width="40px" /> : creator}
        </Text>
      </Flex>
      <Box mb="20px" flexGrow={1}>
        <Text fontSize="20px" fontWeight="800" lineHeight="20px">
          {loading ? <Skeleton width="160px" /> : goal}
        </Text>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4px">
        <Text>Rewards:</Text>
        <Text textAlign="center" fontWeight="800" color={theme.primary}>
          ${loading || !collateral ? <Skeleton width="60px" /> : collateral.multiply(collateralPriceUSD).toFixed(2)}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Text>Time left:</Text>
        {!expiresAt ? (
          <Skeleton width="80px" />
        ) : expiresAt.toJSDate().getTime() < Date.now() ? (
          <KpiExpiredText fontWeight="700">KPI expired</KpiExpiredText>
        ) : (
          <Countdown fontSize="14px" fontWeight="600" to={expiresAt} />
        )}
      </Flex>
      <Box>
        <UndecoratedInternalLink to={`/campaigns/${kpiId}`}>
          <ButtonMedium width="100%">See campaign</ButtonMedium>
        </UndecoratedInternalLink>
      </Box>
    </Card>
  )
}
