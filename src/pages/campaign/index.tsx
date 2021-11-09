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
import { ExternalLink, UndecoratedExternalLink } from '../../components/undecorated-link'
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
import { Twitter } from 'react-feather'
import { Button } from '../../components/button'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

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

const MarkdownDiv = styled.div`
  > h1 {
    font-size: 24px;
    font-weight: 500;
  }

  > p {
    font-size: 16px;
  }
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

const TweetButton = styled(Button)`
  background-color: ${(props) => props.theme.twitter} !important;
  color: ${(props) => props.theme.accentContent} !important;
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

  const [question, setQuestion] = useState('')
  const [status, setStatus] = useState(Status.AWAITING_ANSWER)
  const [currentPeriodEnded, setCurrentPeriodEnded] = useState(false)
  const [kpiProgressPercentage, setKpiProgressPercentage] = useState(new Decimal('0'))

  useEffect(() => {
    let cancelled = false
    const markdownToHtml = async () => {
      if (!kpiToken) return
      try {
        const file = await remark().use(remarkHtml, { sanitize: true }).process(kpiToken.question)
        const content = file?.toString()
        if (content && !cancelled) setQuestion(content)
      } catch (error) {
        console.error('error converting markdown to html', error)
      }
    }
    markdownToHtml()
    return () => {
      cancelled = false
    }
  }, [kpiToken])

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
      <Flex flexDirection="column" mb="60px" width={['100%', '80%', '70%', '55%']}>
        <Flex flexDirection={['column', 'row']} width="100%">
          <Flex width={['100%', '55%', '70%']} flexDirection="column">
            <Card m="8px" height="fit-content">
              <Flex justifyContent="space-between" alignItems="center" mb="16px">
                <Text fontSize="20px" fontWeight="700" color={theme.accent}>
                  {loadingKpiToken || !kpiToken ? (
                    <Skeleton width="120px" />
                  ) : (
                    CREATORS_NAME_MAP[kpiToken.creator] || shortenAddress(kpiToken.creator)
                  )}
                </Text>
                {chainId && kpiToken?.address && (
                  <Box>
                    <ExternalLink href={getExplorerLink(chainId, kpiToken.address, 'address')}>
                      View on explorer <StyledExternalLinkIcon />
                    </ExternalLink>
                  </Box>
                )}
              </Flex>
              <Text fontSize="24px" mb="20px">
                {loadingKpiToken || !kpiToken ? (
                  <>
                    <Skeleton width="100%" />
                    <Skeleton width="120px" />
                  </>
                ) : (
                  <MarkdownDiv dangerouslySetInnerHTML={{ __html: question }} />
                )}
              </Text>
              <Flex flexDirection="column" mb="12px">
                <Title mb="4px">Name:</Title>
                <Text>{loadingKpiToken || !kpiToken ? <Skeleton width="40px" /> : kpiToken.name}</Text>
              </Flex>
              <Flex flexDirection="column" mb="20px">
                <Title mb="4px">Total supply:</Title>
                <Text fontFamily="Overpass Mono">
                  {loadingKpiToken || !kpiToken ? (
                    <Skeleton width="40px" />
                  ) : (
                    `${commify(kpiToken.totalSupply.toFixed(2))} ${kpiToken.symbol}`
                  )}
                </Text>
              </Flex>
              <Box>
                <UndecoratedExternalLink
                  title="Tweet this"
                  href={`https://twitter.com/intent/tweet?text=Check out this Carrot campaign and help me reach the goal!&url=https%3A%2F%2Fcarrot.eth.link%2F%23%2Fcampaigns%2F${kpiToken?.kpiId}?chainId=${chainId}`}
                >
                  <TweetButton icon={<Twitter size="16px" />}>Tweet about this</TweetButton>
                </UndecoratedExternalLink>
              </Box>
            </Card>
            {account && (
              <Card m="8px" flexGrow={1} height="fit-content">
                <Flex justifyContent="space-between" alignItems="center" mb="4px">
                  <Text>Your balance:</Text>
                  <Text fontFamily="Overpass Mono" fontWeight="700">
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
                  <Text fontFamily="Overpass Mono" fontWeight="700">
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
          <Flex flexDirection="column" width={['100%', '45%', '30%']}>
            <Card flexDirection="column" m="8px">
              <Title mb="8px">Time left</Title>
              {!kpiToken ? (
                <Skeleton width="80px" />
              ) : kpiToken.expiresAt.toJSDate().getTime() < Date.now() ? (
                <KpiExpiredText fontFamily="Overpass Mono" fontWeight="700">
                  KPI expired
                </KpiExpiredText>
              ) : (
                <Countdown to={kpiToken.expiresAt} onEnd={handleCountdownEnd} />
              )}
            </Card>
            <Card flexDirection="column" m="8px">
              <Title mb="8px">Rewards</Title>
              <Text mb="4px" fontFamily="Overpass Mono">
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
