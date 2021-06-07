import { useEffect, useState } from 'react'
import { useInterval } from 'react-use'
import { Text } from 'rebass'
import Skeleton from 'react-loading-skeleton'
import { DateTime } from 'luxon'

interface CountdownProps {
  loading?: boolean
  fontSize: string
  fontWeight?: string
  to: DateTime
}

export const Countdown = ({ loading, to, fontSize, fontWeight }: CountdownProps) => {
  const [countdownDuration, setCountdownDuration] = useState(to.diffNow())
  const [countdownText, setCountdownText] = useState('')

  useInterval(() => {
    if (!countdownDuration || countdownDuration.minus(1000).toMillis() < 0) return
    setCountdownDuration(countdownDuration.minus(1000))
  }, 1000)

  useEffect(() => {
    if (!countdownDuration) return
    const rawText = countdownDuration.toFormat('dd/hh/mm/ss')
    const splitRawText = rawText.split('/')
    setCountdownText(`${splitRawText[0]}D ${splitRawText[1]}H ${splitRawText[2]}M ${splitRawText[3]}S`)
  }, [countdownDuration])

  return (
    <Text fontSize={fontSize} fontWeight={fontWeight}>
      {loading ? <Skeleton width="80px" /> : countdownText}
    </Text>
  )
}
