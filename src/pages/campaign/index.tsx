import { ReactElement, useEffect, useState } from 'react'
import { Flex, Box, Text } from 'rebass'
import { RouteComponentProps } from 'react-router-dom'
import { useKpiToken } from '../../hooks/useKpiToken'
import { Card } from '../../components/card'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
import Skeleton from 'react-loading-skeleton'
import { CREATORS_NAME_MAP } from '../../constants'
import styled, { useTheme } from 'styled-components'
import { UndecoratedExternalLink } from '../../components/undecorated-link'
import { CampaignStatusAndActions } from '../../components/campaign-status-and-actions'
import { useWeb3React } from '@web3-react/core'
import { useKpiTokenBalance } from '../../hooks/useKpiTokenBalance'
import { useRewardIfKpiIsReached } from '../../hooks/useRewardIfKpiIsReached'
import { Countdown } from '../../components/countdown'
import { useIsRealityQuestionFinalized } from '../../hooks/useIsRealityQuestionFinalized'
import { ExternalLink } from 'react-feather'

export enum Status {
  AWAITING_EXPIRY,
  AWAITING_ANSWER,
  AWAITING_FINALIZATION,
  KPI_REACHED,
  KPI_NOT_REACHED,
}

const PrimaryUndecoratedExternalLink = styled(UndecoratedExternalLink)`
  color: ${(props) => props.theme.primary};
  text-decoration: underline;
`

const KpiExpiredText = styled(Text)`
  color: ${(props) => props.theme.error};
`

const ExternalLinkIcon = styled(ExternalLink)`
  color: ${(props) => props.theme.primary};
  width: 12px;
  height: 12px;
`

const DividerBox = styled(Box)`
  height: 1px;
  width: 100%;
  background-color: ${(props) => props.theme.divider};
`

export function Campaign({
  match: {
    params: { kpiId },
  },
}: RouteComponentProps<{ kpiId: string }>): ReactElement {
  const theme = useTheme()
  const { account } = useWeb3React()
  const { kpiToken, loading: loadingKpiToken } = useKpiToken(kpiId)
  const { balance: kpiTokenBalance, loading: loadingKpiTokenBalance } = useKpiTokenBalance(
    kpiToken,
    account || undefined
  )
  const { realityQuestionFinalized, loading: loadingRealityQuestionFinalized } = useIsRealityQuestionFinalized(
    kpiToken?.kpiId
  )
  const rewardIfKpiIsReached = useRewardIfKpiIsReached(kpiToken, kpiTokenBalance)
  const { priceUSD: collateralPriceUSD, loading: loadingCollateralTokenPrice } = useTokenPriceUSD(
    kpiToken?.collateral.token
  )

  const [status, setStatus] = useState(Status.AWAITING_ANSWER)

  useEffect(() => {
    if (!kpiToken || loadingRealityQuestionFinalized) return
    if (kpiToken.expiresAt.toJSDate().getTime() > Date.now()) {
      setStatus(Status.AWAITING_EXPIRY)
    } else if (realityQuestionFinalized) {
      if (kpiToken.finalized) {
        setStatus(kpiToken.kpiReached ? Status.KPI_REACHED : Status.KPI_NOT_REACHED)
      } else {
        setStatus(Status.AWAITING_FINALIZATION)
      }
    } else {
      setStatus(Status.AWAITING_ANSWER)
    }
  }, [kpiToken, loadingRealityQuestionFinalized, realityQuestionFinalized])

  return (
    <Flex flexDirection="column" alignItems="center" width="100%">
      <Flex flexDirection="column" mb="60px" width="100%">
        <Flex mx="8px" width="100%" flexDirection={['column', 'row']}>
          <Flex flexGrow={[0, 1]} flexDirection="column" width={['100%', '65%']}>
            <Card m="8px" height="fit-content">
              <Text fontSize="20px" fontWeight="700" color={theme.primary} mb="16px">
                {loadingKpiToken || !kpiToken ? (
                  <Skeleton width="40px" />
                ) : (
                  CREATORS_NAME_MAP[kpiToken.creator] || kpiToken.creator
                )}
              </Text>
              <Text fontSize="24px" mb="20px">
                {loadingKpiToken || !kpiToken ? <Skeleton count={3} width="80px" /> : kpiToken.question}
              </Text>
              <Flex justifyContent="space-between" alignItems="center" mb="4px">
                <Text>Symbol:</Text>
                <Text fontSize="18px" fontWeight="700">
                  {loadingKpiToken || !kpiToken ? <Skeleton width="40px" /> : kpiToken.symbol}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb="4px">
                <Text>Name:</Text>
                <Text fontSize="18px" fontWeight="700">
                  {loadingKpiToken || !kpiToken ? <Skeleton width="40px" /> : kpiToken.name}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb="20px">
                <Text>Total supply:</Text>
                <Text fontSize="18px" fontWeight="700">
                  {loadingKpiToken || !kpiToken ? <Skeleton width="40px" /> : `${kpiToken.totalSupply.toFixed(2)}`}
                </Text>
              </Flex>
              <Box>
                <PrimaryUndecoratedExternalLink href={`https://rinkeby.etherscan.io/address/${kpiToken?.address}`}>
                  View on explorer <ExternalLinkIcon />
                </PrimaryUndecoratedExternalLink>
              </Box>
            </Card>
            {account && (
              <Card m="8px" flexGrow={1} height="fit-content">
                <Flex justifyContent="space-between" alignItems="center" mb="4px">
                  <Text>Your balance:</Text>
                  <Text fontSize="18px" fontWeight="700">
                    {loadingKpiTokenBalance || !kpiToken || !kpiTokenBalance ? (
                      <Skeleton width="80px" />
                    ) : (
                      kpiTokenBalance.toFixed(4)
                    )}
                  </Text>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center" mb="20px">
                  <Text>Reward if KPI is reached:</Text>
                  <Text fontSize="18px" fontWeight="700">
                    {!rewardIfKpiIsReached ? (
                      <Skeleton width="80px" />
                    ) : (
                      `${rewardIfKpiIsReached.toFixed(4)} ($${rewardIfKpiIsReached
                        ?.multiply(collateralPriceUSD)
                        .toFixed(2)})`
                    )}
                  </Text>
                </Flex>
                <DividerBox mb="20px" />
                <Flex flexDirection="column">
                  <CampaignStatusAndActions status={status} kpiToken={kpiToken} />
                </Flex>
              </Card>
            )}
          </Flex>
          <Flex flexDirection="column" width={['100%', '35%']}>
            <Card flexDirection="column" m="8px">
              <Text mb="8px" fontWeight="700">
                Time left
              </Text>
              {!kpiToken ? (
                <Skeleton width="80px" />
              ) : kpiToken.expiresAt.toJSDate().getTime() < Date.now() ? (
                <KpiExpiredText fontWeight="700">KPI expired</KpiExpiredText>
              ) : (
                <Countdown to={kpiToken.expiresAt} fontSize="20px" />
              )}
            </Card>
            <Card flexDirection="column" m="8px">
              <Text mb="8px" fontWeight="700">
                Rewards
              </Text>
              <Text fontSize="20px" mb="4px">
                {loadingKpiToken || !kpiToken ? (
                  <Skeleton width="80px" />
                ) : (
                  `${kpiToken.collateral.toFixed(4)} ${kpiToken.collateral.token.symbol}`
                )}
              </Text>
              <Text fontSize="20px">
                {loadingKpiToken || loadingCollateralTokenPrice || !kpiToken ? (
                  <Skeleton width="80px" />
                ) : (
                  `$${kpiToken.collateral.multiply(collateralPriceUSD).toFixed(2)}`
                )}
              </Text>
            </Card>
            <Card flexDirection="column" m="8px">
              <Text mb="8px" fontWeight="700">
                Oracle
              </Text>
              <Text fontSize="20px" mb="4px">
                Reality.eth (
                <UndecoratedExternalLink href={`https://reality.eth.link/app/#!/question/${kpiId}`}>
                  see question
                </UndecoratedExternalLink>
                )
              </Text>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
