import { useEffect, useState } from 'react'
import useInterval from 'react-use/lib/useInterval'
import { Flex, Text } from 'rebass'
import Skeleton from 'react-loading-skeleton'
import { DateTime, Duration } from 'luxon'
import styled from 'styled-components'

interface CountdownProps {
  loading?: boolean
  fontSize?: string
  fontWeight?: string
  to: DateTime
  textAlign?: 'right'
  onEnd?: () => void
}

const StyledText = styled(Text)`
  color: ${(props) => props.theme.content};
  transition: color 0.2s ease;
`

export const Countdown = ({ loading, to, fontSize, fontWeight, textAlign, onEnd }: CountdownProps) => {
  const [isRunning, setIsRunning] = useState(false)
  const [duration, setDuration] = useState(Duration.fromMillis(0))
  const [durationParts, setDurationParts] = useState<{ days: string; hours: string; minutes: string; seconds: string }>(
    { days: '00', hours: '00', minutes: '00', seconds: '00' }
  )

  useEffect(() => {
    const isRunning = to.toMillis() > Date.now() - 1000 // more than one second required
    setIsRunning(isRunning)
    setDuration(Duration.fromMillis(isRunning ? to.minus({ milliseconds: Date.now() }).toMillis() : 0))
  }, [to])

  useInterval(
    () => {
      const newDuration = duration.minus(1000)
      if (onEnd && newDuration.toMillis() <= 1000) {
        onEnd()
        setDuration(Duration.fromMillis(0))
      } else setDuration(newDuration)
    },
    isRunning ? 1000 : null
  )

  useEffect(() => {
    const rawText = duration.toFormat('dd/hh/mm/ss')
    const splitRawText = rawText.split('/')
    setDurationParts({
      days: splitRawText[0],
      hours: splitRawText[1],
      minutes: splitRawText[2],
      seconds: splitRawText[3],
    })
  }, [duration])

  return (
    <Text fontSize={fontSize} fontWeight={fontWeight}>
      {loading ? (
        <Skeleton width="80px" />
      ) : (
        <Flex alignItems="center">
          <StyledText fontFamily="Overpass Mono" textAlign={textAlign} fontSize={fontSize}>
            {durationParts.days}D {durationParts.hours}H {durationParts.minutes}M {durationParts.seconds}S
          </StyledText>
        </Flex>
      )}
    </Text>
  )
}
