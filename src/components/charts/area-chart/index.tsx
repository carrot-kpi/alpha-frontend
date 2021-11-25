import { XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart as RechartsAreaChart, Area } from 'recharts'
import styled, { useTheme } from 'styled-components'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { TokenPriceMetric } from '../../../constants/featured-campaigns/metrics'
import { ChartDataPoint } from '../../../constants/featured-campaigns/platforms'
import { Flex, Text } from 'rebass'
import Loader from 'react-spinners/BarLoader'
import { CustomTooltip } from '../custom-tooltip'

const ChartContainer = styled.div`
  height: 300px;
`

interface AreaChartProps {
  metric: TokenPriceMetric
}

export const AreaChart = ({ metric }: AreaChartProps) => {
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    let cancelled = false
    const fetchChartData = async () => {
      if (metric.from.toMillis() > Date.now()) return
      if (!cancelled) setLoading(true)
      try {
        const data = await metric.chartData()
        if (!cancelled) setChartData(data.sort((a, b) => a.x - b.x))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchChartData()
    return () => {
      cancelled = false
    }
  }, [metric])

  return (
    <ChartContainer>
      {loading ? (
        <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
          <Loader css="display: block;" color={theme.accent} loading />
        </Flex>
      ) : metric.from.toMillis() > Date.now() ? (
        <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
          <Text maxWidth={['80%', '70%', '60%']} textAlign="center">
            Data will be collected and displayed in this chart once the campaign period starts at{' '}
            {metric.from.toLocaleString(DateTime.DATETIME_MED)} local time
          </Text>
        </Flex>
      ) : chartData.length === 0 ? (
        <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
          <Text textAlign="center">No data</Text>
        </Flex>
      ) : (
        <ResponsiveContainer>
          <RechartsAreaChart data={chartData}>
            <defs>
              <linearGradient id="custom-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.accentStart} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.surface} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              minTickGap={80}
              tickFormatter={(tick) => DateTime.fromMillis(tick).toFormat('DD')}
              dataKey="x"
              tick={{ fill: theme.surfaceContent }}
              type="number"
              domain={[metric.from.toMillis(), metric.to.toMillis()]}
            />
            <YAxis type="number" axisLine={false} interval="preserveEnd" tick={false} />
            <Tooltip cursor={{ fill: theme.border }} content={CustomTooltip} />
            <Area type="monotone" dataKey="y" fill="url(#custom-gradient)" stroke={theme.accent} />
          </RechartsAreaChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  )
}
