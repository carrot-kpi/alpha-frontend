import { useEffect, useState } from 'react'
import { useInterval } from 'react-use'
import { Text } from 'rebass'
import Skeleton from 'react-loading-skeleton'
import { DateTime, Duration } from 'luxon'

interface CountdownProps {
  loading?: boolean
  fontSize?: string
  fontWeight?: string
  to: DateTime
  onEnd?: () => void
}

export const Countdown = ({ loading, to, fontSize, fontWeight, onEnd }: CountdownProps) => {
  const [isRunning, setIsRunning] = useState(false)
  const [duration, setDuration] = useState(Duration.fromMillis(0))
  const [durationText, setDurationText] = useState('')

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
    setDurationText(`${splitRawText[0]}D ${splitRawText[1]}H ${splitRawText[2]}M ${splitRawText[3]}S`)
  }, [duration])

  return (
    <Text fontSize={fontSize} fontWeight={fontWeight}>
      {loading ? <Skeleton width="80px" /> : durationText}
    </Text>
  )
}
