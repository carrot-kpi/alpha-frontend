import { XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart as RechartsAreaChart, Area } from 'recharts'
import styled, { useTheme } from 'styled-components'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { commify } from '@ethersproject/units'
import { TokenPriceMetric } from '../../../constants/featured-campaigns/metrics'
import { ChartDataPoint } from '../../../constants/featured-campaigns/platforms'

const ChartContainer = styled.div`
  height: 300px;
`

interface BarChartProps {
  metric: TokenPriceMetric
}

export const AreaChart = ({ metric }: BarChartProps) => {
  const theme = useTheme()

  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    let cancelled = false
    const fetchChartData = async () => {
      const data = await metric.chartData()
      if (!cancelled) setChartData(data)
    }
    fetchChartData()
    return () => {
      cancelled = false
    }
  }, [metric])

  return (
    <ChartContainer>
      {chartData.length > 0 && (
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
              interval="preserveEnd"
              minTickGap={80}
              tickFormatter={(tick) => DateTime.fromMillis(tick).toFormat('DD')}
              dataKey="x"
              tick={{ fill: theme.surfaceContent }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis type="number" axisLine={false} interval="preserveEnd" yAxisId={0} tick={false} />
            <Tooltip
              cursor={{ fill: theme.border }}
              formatter={(val: string) => `$${commify(val)}`}
              labelFormatter={(label) => DateTime.fromMillis(label).toFormat('DD')}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '8px 12px',
                borderRadius: 8,
                borderColor: theme.border,
                color: 'black',
              }}
            />
            <Area type="natural" dataKey="y" fill="url(#custom-gradient)" yAxisId={0} stroke={theme.accent} />
          </RechartsAreaChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  )
}
