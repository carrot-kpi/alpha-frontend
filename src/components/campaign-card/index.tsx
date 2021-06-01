import { Box, Flex, Text } from 'rebass'
import { Duration } from 'luxon'
import { ButtonMedium } from '../button'
import styled, { useTheme } from 'styled-components'
import { CheckCircle } from 'react-feather'
import { useState } from 'react'
import { useInterval } from 'react-use'
import { Calendar } from 'react-feather'
import { TokenAmount } from 'carrot-sdk'
import { useTokenPriceUSD } from '../../hooks/useTokenPriceUSD'
// import { ProgressBar } from '../progress-bar'

const RootContainer = styled(Flex)`
  background-color: ${(props) => props.theme.white};
  border: 1px solid ${(props) => props.theme.divider};
  box-sizing: border-box;
  box-shadow: 0px 45px 80px rgba(255, 163, 112, 0.2);
  border-radius: 15px;
`

const DurationContainer = styled(Flex)`
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 10px;
  background-color: #e1f5fd;
  border-radius: 20px;
`

interface CampaignCardProps {
  creator: string
  duration: Duration
  goal: string
  collateral: TokenAmount
  progress: number
  lowerBound: number
  higherBound: number
}

export function CampaignCard({
  creator,
  duration,
  goal,
  collateral,
  progress,
  lowerBound,
  higherBound,
}: CampaignCardProps) {
  const theme = useTheme()
  const { priceUSD: collateralPriceUSD } = useTokenPriceUSD(collateral.token)

  const [countdownDuration, setCountdownDuration] = useState(duration)
  const [countdownText, setCountdownText] = useState('')

  useInterval(() => {
    setCountdownDuration(countdownDuration.minus(1000))
    const rawText = countdownDuration.toFormat('dd/hh/mm/ss')
    const splitRawText = rawText.split('/')
    setCountdownText(`${splitRawText[0]}D ${splitRawText[1]}H ${splitRawText[2]}M ${splitRawText[3]}S`)
  }, 1000)

  return (
    <RootContainer p="24px 32px" flexDirection="column">
      <Flex width="100%" justifyContent="space-between" mb="16px">
        <Text fontSize="20px" fontWeight="700" lineHeight="30px" color={theme.primary1}>
          {creator}
        </Text>
        <DurationContainer alignItems="center">
          <Box mr="4px">
            <Calendar size="12px" color="#B1B5C3" />
          </Box>
          <Text fontSize="12px" fontWeight="600" color="#B1B5C3">
            {countdownText}
          </Text>
        </DurationContainer>
      </Flex>
      <Flex mb="32px">
        <Box mr="12px">
          <CheckCircle size="16px" />
        </Box>
        <Text fontSize="20px" fontWeight="800" lineHeight="20px">
          {goal}
        </Text>
      </Flex>
      {/* <Box mb="32px">
        <ProgressBar lowerBound={lowerBound} higherBound={higherBound} progress={progress} />
      </Box> */}
      <Box mb="24px">
        <ButtonMedium width="100%">See campaign</ButtonMedium>
      </Box>
      <Text textAlign="center" fontSize="20px" fontWeight="800" lineHeight="32px" color={theme.primary1}>
        ${collateral.multiply(collateralPriceUSD).toFixed(2)}
      </Text>
    </RootContainer>
  )
}
