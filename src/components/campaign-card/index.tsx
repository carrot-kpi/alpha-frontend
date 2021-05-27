import { Box, Flex } from 'rebass'
import { Duration } from 'luxon'
import { ButtonMedium } from '../button'
import styled from 'styled-components'

const RootContainer = styled(Flex)`
  width: 352px;
  height: 372px;
  background-color: ${(props) => props.theme.white};
  border: 1px solid ${(props) => props.theme.divider};
  box-sizing: border-box;
  box-shadow: 0px 45px 80px rgba(255, 163, 112, 0.2);
  border-radius: 15px;
`

interface CampaignCardProps {
  creator: string
  duration: Duration
  goal: string
  rewardsUSD: number
}

export function CampaignCard({ creator, duration, goal }: CampaignCardProps) {
  return (
    <RootContainer p="24px 32px" flexDirection="column">
      <Flex width="100%" justifyContent="space-between" mb="16px">
        <Box>{creator}</Box>
        <Box>{duration.toObject().hours}</Box>
      </Flex>
      <Box mb="20px">{goal}</Box>
      <Box mb="28px">
        <ButtonMedium>See campaign</ButtonMedium>
      </Box>
    </RootContainer>
  )
}
