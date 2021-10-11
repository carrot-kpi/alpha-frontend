import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Flex, Box, Text } from 'rebass'
import { RouteComponentProps } from 'react-router-dom'
import { useKpiToken } from '../../hooks/useKpiToken'
import { Card } from '../../components/card'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
import Skeleton from 'react-loading-skeleton'
import { CREATORS_NAME_MAP } from '../../constants'
import styled, { useTheme } from 'styled-components'
import { ExternalLink } from '../../components/undecorated-link'
import { CampaignStatusAndActions } from '../../components/campaign-status-and-actions'
import { useKpiTokenBalance } from '../../hooks/useKpiTokenBalance'
import { useRewardIfKpiIsReached } from '../../hooks/useRewardIfKpiIsReached'
import { Countdown } from '../../components/countdown'
import { useIsRealityQuestionFinalized } from '../../hooks/useIsRealityQuestionFinalized'
import { ExternalLink as ExternalLinkIcon } from 'react-feather'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { getExplorerLink, shortenAddress } from '../../utils'
import { commify } from '@ethersproject/units'
import { useIsKpiTokenFinalized } from '../../hooks/useIsKpiTokenFinalized'
import { useKpiTokenProgress } from '../../hooks/useKpiTokenProgress'
import Decimal from 'decimal.js-light'
import { Title } from '../../components/title'
import { Charts } from '../../components/charts'
import { FEATURED_CAMPAIGNS } from '../../constants/featured-campaigns'

export enum Status {
  AWAITING_EXPIRY,
  AWAITING_ANSWER,
  AWAITING_FINALIZATION,
  KPI_REACHED,
  KPI_NOT_REACHED,
}

const KpiExpiredText = styled(Text)`
  color: ${(props) => props.theme.negativeSurfaceContent};
`

const EllipsizedText = styled(Text)`
  white-space: nowrap;
  text-overflow: ellipsis;
`

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
  color: ${(props) => props.theme.accent};
  width: 12px;
  height: 12px;
`

const DividerBox = styled(Box)`
  height: 1px;
  width: 100%;
  background-color: ${(props) => props.theme.border};
  transition: background-color 0.2s ease;
`

export function Campaign({
  match: {
    params: { kpiId },
  },
}: RouteComponentProps<{ kpiId: string }>): ReactElement {
  const theme = useTheme()
  const { account, chainId } = useActiveWeb3React()
  const featuredCampaignSpec = useMemo(
    () => (chainId ? FEATURED_CAMPAIGNS[chainId].find((campaign) => campaign.kpiId === kpiId) : undefined),
    [kpiId, chainId]
  )
  const { kpiToken, loading: loadingKpiToken } = useKpiToken(kpiId)
  const { balance: kpiTokenBalance, loading: loadingKpiTokenBalance } = useKpiTokenBalance(kpiToken, account)
  const { loading: loadingRealityQuestionFinalized, finalized: realityQuestionFinalized } =
    useIsRealityQuestionFinalized(kpiId)
  const rewardIfKpiIsReached = useRewardIfKpiIsReached(kpiToken, kpiTokenBalance)
  const collateralPriceUSD = useTokenPriceUSD(kpiToken?.collateral.currency)
  // these auto updates at each block, instead of using the static value attached to the kpi token ts instance
  const { loading: loadingKpiTokenFinalized, finalized: kpiTokenFinalized } = useIsKpiTokenFinalized(kpiToken)
  const { loading: loadingKpiTokenProgress, progress: kpiTokenProgress } = useKpiTokenProgress(kpiToken)

  const [status, setStatus] = useState(Status.AWAITING_ANSWER)
  const [currentPeriodEnded, setCurrentPeriodEnded] = useState(false)
  const [kpiProgressPercentage, setKpiProgressPercentage] = useState(new Decimal('0'))

  useEffect(() => {
    if (!kpiToken || loadingKpiTokenProgress) return
    const kpiScalarRange = kpiToken.higherBound.sub(kpiToken.lowerBound)
    setKpiProgressPercentage(new Decimal(kpiTokenProgress.toString()).dividedBy(kpiScalarRange.toString()).times(100))
  }, [kpiToken, kpiTokenProgress, loadingKpiTokenProgress])

  useEffect(() => {
    if (!kpiToken || loadingRealityQuestionFinalized || loadingKpiTokenFinalized || loadingKpiTokenProgress) return
    if (kpiToken.expiresAt.toJSDate().getTime() > Date.now()) setStatus(Status.AWAITING_EXPIRY)
    else if (realityQuestionFinalized) {
      if (kpiTokenFinalized)
        setStatus(kpiProgressPercentage.equals('100') ? Status.KPI_REACHED : Status.KPI_NOT_REACHED)
      else setStatus(Status.AWAITING_FINALIZATION)
    } else setStatus(Status.AWAITING_ANSWER)
    setCurrentPeriodEnded(false)
  }, [
    kpiProgressPercentage,
    kpiToken,
    kpiTokenFinalized,
    loadingKpiTokenFinalized,
    loadingKpiTokenProgress,
    loadingRealityQuestionFinalized,
    realityQuestionFinalized,
    currentPeriodEnded,
  ])

  const handleCountdownEnd = useCallback(() => {
    setCurrentPeriodEnded(true)
  }, [])

  if (!featuredCampaignSpec) return <Redirect to="/" />
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%">
      <Flex flexDirection="column" mb="60px" width={['100%', '80%', '60%', '60%', '40%']}>
        <Flex mx="8px" flexDirection={['column', 'row']} width="100%">
          <Flex flexGrow={[0, 1]} flexDirection="column">
            <Card m="8px" height="fit-content">
              <Text fontSize="20px" fontWeight="700" color={theme.accent} mb="16px">
                {loadingKpiToken || !kpiToken ? (
                  <Skeleton width="40px" />
                ) : (
                  CREATORS_NAME_MAP[kpiToken.creator] || shortenAddress(kpiToken.creator)
                )}
              </Text>
              <Text fontSize="24px" mb="20px">
                {loadingKpiToken || !kpiToken ? <Skeleton width="120px" /> : kpiToken.question}
              </Text>
              <Flex flexDirection="column" mb="12px">
                <Title mb="4px">Symbol:</Title>
                <EllipsizedText fontSize="18px" overflow="hidden">
                  {loadingKpiToken || !kpiToken ? <Skeleton width="40px" /> : kpiToken.symbol}
                </EllipsizedText>
              </Flex>
              <Flex flexDirection="column" mb="12px">
                <Title mb="4px">Name:</Title>
                <Text fontSize="18px">{loadingKpiToken || !kpiToken ? <Skeleton width="40px" /> : kpiToken.name}</Text>
              </Flex>
              <Flex flexDirection="column" mb="20px">
                <Title mb="4px">Total supply:</Title>
                <Text fontSize="18px">
                  {loadingKpiToken || !kpiToken ? (
                    <Skeleton width="40px" />
                  ) : (
                    `${commify(kpiToken.totalSupply.toFixed(2))}`
                  )}
                </Text>
              </Flex>
              {chainId && kpiToken?.address && (
                <Box>
                  <ExternalLink href={getExplorerLink(chainId, kpiToken.address, 'address')}>
                    View on explorer <StyledExternalLinkIcon />
                  </ExternalLink>
                </Box>
              )}
            </Card>
            {account && (
              <Card m="8px" flexGrow={1} height="fit-content">
                <Flex justifyContent="space-between" alignItems="center" mb="4px">
                  <Text>Your balance:</Text>
                  <Text fontSize="18px" fontWeight="700">
                    {loadingKpiTokenBalance || !kpiToken || !kpiTokenBalance ? (
                      <Skeleton width="80px" />
                    ) : (
                      `${kpiTokenBalance.toFixed(4)} ${kpiToken.symbol}`
                    )}
                  </Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  mb={kpiTokenBalance && !kpiTokenBalance.isZero() ? '20px' : '0px'}
                >
                  <Text>Reward if KPI is reached:</Text>
                  <Text fontSize="18px" fontWeight="700">
                    {!rewardIfKpiIsReached ? (
                      <Skeleton width="80px" />
                    ) : (
                      `${rewardIfKpiIsReached.toFixed(4)} ${kpiToken?.collateral.currency.symbol} ($${
                        collateralPriceUSD.isZero()
                          ? '-'
                          : rewardIfKpiIsReached?.multiply(collateralPriceUSD).toFixed(2)
                      })`
                    )}
                  </Text>
                </Flex>
                {kpiTokenBalance && !kpiTokenBalance.isZero() && (
                  <>
                    <DividerBox mb="20px" />
                    <Box>
                      <CampaignStatusAndActions
                        status={status}
                        kpiToken={kpiToken}
                        kpiTokenBalance={kpiTokenBalance}
                        kpiProgressPercentage={kpiProgressPercentage}
                      />
                    </Box>
                  </>
                )}
              </Card>
            )}
            <Charts metrics={featuredCampaignSpec?.metrics} />
          </Flex>
          <Flex flexDirection="column" width={['100%', '35%', '50%']}>
            <Card flexDirection="column" m="8px">
              <Title mb="8px">Time left</Title>
              {!kpiToken ? (
                <Skeleton width="80px" />
              ) : kpiToken.expiresAt.toJSDate().getTime() < Date.now() ? (
                <KpiExpiredText fontWeight="700">KPI expired</KpiExpiredText>
              ) : (
                <Countdown to={kpiToken.expiresAt} onEnd={handleCountdownEnd} />
              )}
            </Card>
            <Card flexDirection="column" m="8px">
              <Title mb="8px">Rewards</Title>
              <Text mb="4px">
                {loadingKpiToken || !kpiToken ? (
                  <Skeleton width="80px" />
                ) : (
                  `${kpiToken.collateral.toFixed(4)} ${kpiToken.collateral.currency.symbol} ($${
                    collateralPriceUSD.isZero()
                      ? '-'
                      : commify(kpiToken.collateral.multiply(collateralPriceUSD).toFixed(2))
                  })`
                )}
              </Text>
            </Card>
            <Card flexDirection="column" m="8px">
              <Title mb="8px">Oracle</Title>
              <Text>
                Reality.eth (
                <ExternalLink href={`https://reality.eth.link/app/#!/question/${kpiId}`}>see question</ExternalLink>)
              </Text>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
