import { ReactElement, useEffect, useState } from 'react'
import { Flex, Box, Text } from 'rebass'
import { RouteComponentProps } from 'react-router-dom'
import { useKpiToken } from '../../hooks/useKpiToken'
import { Card } from '../../components/card'
import { ButtonSmall } from '../../components/button'
import { useInterval } from 'react-use'
import { Duration } from 'luxon'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
import Skeleton from 'react-loading-skeleton'
import { CREATORS_NAME_MAP } from '../../constants'
import { useTheme } from 'styled-components'
import { UndecoratedExternalLink } from '../../components/undecorated-link'
import { useWeb3React } from '@web3-react/core'
import { useKpiTokenBalance } from '../../hooks/useKpiTokenBalance'
import { useRewardIfKpiIsReached } from '../../hooks/useRewardIfKpiIsReached'

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
  const rewardIfKpiIsReached = useRewardIfKpiIsReached(kpiToken, kpiTokenBalance)
  const { priceUSD: collateralPriceUSD, loading: loadingCollateralTokenPrice } = useTokenPriceUSD(
    kpiToken?.collateral.token
  )

  const [countdownDuration, setCountdownDuration] = useState(
    kpiToken ? kpiToken.expiresAt.diffNow() : Duration.fromMillis(0)
  )
  const [countdownText, setCountdownText] = useState('')

  useInterval(() => {
    if (!countdownDuration) return
    setCountdownDuration(countdownDuration.minus(1000))
  }, 1000)

  useEffect(() => {
    const rawText = countdownDuration.toFormat('dd/hh/mm/ss')
    const splitRawText = rawText.split('/')
    setCountdownText(`${splitRawText[0]}D ${splitRawText[1]}H ${splitRawText[2]}M ${splitRawText[3]}S`)
  }, [countdownDuration])

  return (
    <Flex flexDirection="column" alignItems="center">
      <Flex flexDirection="column" mb="60px">
        <Flex mx="8px" width="100%">
          <Flex flexGrow={1} flexDirection="column">
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
              <Flex justifyContent="space-between" alignItems="center" mb="20px">
                <Text>Total supply:</Text>
                <Text fontSize="18px" fontWeight="700">
                  {loadingKpiToken || !kpiToken ? <Skeleton width="40px" /> : `${kpiToken.totalSupply.toFixed(2)}`}
                </Text>
              </Flex>
              <Box>
                <ButtonSmall
                  as={UndecoratedExternalLink}
                  href={`https://rinkeby.etherscan.io/address/${kpiToken?.address}`}
                >
                  View on explorer
                </ButtonSmall>
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
                <Flex justifyContent="space-between" alignItems="center">
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
              </Card>
            )}
          </Flex>
          <Flex flexDirection="column" width="35%">
            <Card flexDirection="column" m="8px">
              <Text mb="8px" fontWeight="700">
                Time left
              </Text>
              <Text fontSize="20px">{!countdownText ? <Skeleton width="80px" /> : countdownText}</Text>
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
