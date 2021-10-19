import { XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart as RechartsBarChart, Bar } from 'recharts'
import styled, { useTheme } from 'styled-components'
import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { commify } from '@ethersproject/units'
import { PairLiquidityMetric, TokenMarketCapMetric, TvlMetric } from '../../../constants/featured-campaigns/metrics'
import { ChartDataPoint } from '../../../constants/featured-campaigns/platforms'
import { Box, Flex } from 'rebass'
import Loader from 'react-spinners/ScaleLoader'

const ChartContainer = styled.div`
  height: 300px;
`

interface BarChartProps {
  metric: TvlMetric | PairLiquidityMetric | TokenMarketCapMetric
}

export const BarChart = ({ metric }: BarChartProps) => {
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    let cancelled = false
    const fetchChartData = async () => {
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
          <Box width="60px" height="60px">
            <Loader color={theme.accent} loading />
          </Box>
        </Flex>
      ) : chartData.length === 0 ? (
        <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
          <Box>No data</Box>
        </Flex>
      ) : (
        <ResponsiveContainer>
          <RechartsBarChart barCategoryGap={1} data={chartData}>
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
            <YAxis type="number" axisLine={false} interval="preserveEnd" tick={false} />
            <Tooltip
              cursor={{ fill: theme.border }}
              formatter={(val: string | number | (string | number)[]) =>
                val instanceof Array ? '' : `$${commify(val)}`
              }
              labelFormatter={(label: string | number) =>
                DateTime.fromMillis(parseInt(label.toString())).toLocaleString(DateTime.DATETIME_MED)
              }
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '8px 12px',
                borderRadius: 12,
                borderColor: theme.border,
                color: 'black',
              }}
            />
            <Bar dataKey="y" fill={theme.accent} stroke={theme.accent} />
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  )
}
