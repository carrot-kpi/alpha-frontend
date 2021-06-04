import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Flex, Box, Text } from 'rebass'
import { RouteComponentProps } from 'react-router-dom'
import { useKpiToken } from '../../hooks/useKpiToken'
import { Card } from '../../components/card'
import { ButtonSmall } from '../../components/button'
import { Footer } from '../../components/footer'
import { useInterval } from 'react-use'
import { Duration } from 'luxon'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
import Skeleton from 'react-loading-skeleton'
import { CREATORS_NAME_MAP } from '../../constants'
import { useTheme } from 'styled-components'
import { UndecoratedExternalLink } from '../../components/undecorated-link'

export function Campaign({
  match: {
    params: { kpiId },
  },
}: RouteComponentProps<{ kpiId: string }>): ReactElement {
  const theme = useTheme()
  const { kpiToken, loading: loadingKpiToken } = useKpiToken(kpiId)
  const { priceUSD: collateralPriceUSD, loading: loadingCollateralTokenPrice } = useTokenPriceUSD(
    kpiToken?.collateral.token
  )
  const loading = useMemo(
    () => loadingKpiToken || loadingCollateralTokenPrice,
    [loadingCollateralTokenPrice, loadingKpiToken]
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
      <Flex flexDirection="column" width={['100%', '80%', '60%', '50%']} mb="60px">
        <Flex mx="8px" width="100%">
          <Flex flexGrow={1} flexDirection="column">
            <Card m="8px" height="fit-content">
              <Text fontSize="20px" fontWeight="700" color={theme.primary1} mb="16px">
                {loading || !kpiToken ? (
                  <Skeleton width="40px" />
                ) : (
                  CREATORS_NAME_MAP[kpiToken.creator] || kpiToken.creator
                )}
              </Text>
              <Text fontSize="24px" mb="20px">
                {loading || !kpiToken ? <Skeleton count={3} width="80px" /> : kpiToken.question}
              </Text>
              <Flex justifyContent="space-between" alignItems="center" mb="4px">
                <Text>Symbol:</Text>
                <Text fontSize="18px" fontWeight="700">
                  {loading || !kpiToken ? <Skeleton width="40px" /> : kpiToken.symbol}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb="20px">
                <Text>Total supply:</Text>
                <Text fontSize="18px" fontWeight="700">
                  {loading || !kpiToken ? <Skeleton width="40px" /> : `${kpiToken.totalSupply.toFixed(2)}`}
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
            <Card m="8px" flexGrow={1} height="fit-content">
              <Flex justifyContent="space-between" alignItems="center" mb="4px">
                <Text>Your balance:</Text>
                <Text fontSize="18px" fontWeight="700">
                  FAKE
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text>Reward if KPI is reached:</Text>
                <Text fontSize="18px" fontWeight="700">
                  FAKE
                </Text>
              </Flex>
            </Card>
          </Flex>
          <Flex flexDirection="column" width="35%">
            <Card flexDirection="column" m="8px">
              <Text mb="8px" fontWeight="700">
                Time left
              </Text>
              <Text fontSize="20px">{loading ? <Skeleton width="80px" /> : countdownText}</Text>
            </Card>
            <Card flexDirection="column" m="8px">
              <Text mb="8px" fontWeight="700">
                Rewards
              </Text>
              <Text fontSize="20px" mb="4px">
                {loading || !kpiToken ? (
                  <Skeleton width="80px" />
                ) : (
                  `${kpiToken.collateral.toFixed(4)} ${kpiToken.collateral.token.symbol}`
                )}
              </Text>
              <Text fontSize="20px">
                {loading || !kpiToken ? (
                  <Skeleton width="80px" />
                ) : (
                  `$${kpiToken.collateral.multiply(collateralPriceUSD).toFixed(2)}`
                )}
              </Text>
            </Card>
          </Flex>
        </Flex>
      </Flex>
      <Footer />
    </Flex>
  )
}
