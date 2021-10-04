import { XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts'
import styled, { useTheme } from 'styled-components'
import { DayData, useSwaprPairLiquidityDayData } from '../../../hooks/useSwaprPairLiquidityDayData'
import { useEffect, useState } from 'react'
import { Token } from '@carrot-kpi/sdk'
import { DateTime } from 'luxon'
import { commify } from '@ethersproject/units'
import Decimal from 'decimal.js-light'

const ChartContainer = styled.div`
  height: 300px;
`

interface SwaprLiquidityChartProps {
  token0: Token
  token1: Token
  startDate: DateTime
  endDate: DateTime
}

export const SwaprLiquidityChart = ({ token0, token1, startDate, endDate }: SwaprLiquidityChartProps) => {
  const theme = useTheme()
  const { data } = useSwaprPairLiquidityDayData(token0, token1)

  const [chartData, setChartData] = useState<DayData[]>([])

  useEffect(() => {
    if (data && data.length > 0) {
      const startDateSeconds = startDate.toSeconds()
      const endDateSeconds = endDate.toSeconds()
      setChartData(data.filter((item) => item.date >= startDateSeconds && item.date <= endDateSeconds))
    }
  }, [data, endDate, startDate])

  return (
    <ChartContainer>
      {chartData.length > 0 && (
        <ResponsiveContainer>
          <BarChart barCategoryGap={1} data={chartData}>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={80}
              tickFormatter={(tick) => DateTime.fromSeconds(tick).toFormat('DD')}
              dataKey="date"
              tick={{ fill: theme.surfaceContent }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis type="number" axisLine={false} interval="preserveEnd" yAxisId={0} tick={false} />
            <Tooltip
              cursor={{ fill: theme.border }}
              formatter={(val: string) => `$${commify(new Decimal(val).toFixed(2))}`}
              labelFormatter={(label) => DateTime.fromSeconds(label).toFormat('DD')}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '8px 12px',
                borderRadius: 12,
                borderColor: theme.border,
                color: 'black',
              }}
            />
            <Bar
              type="monotone"
              name={'Liquidity'}
              dataKey={'reserveUSD'}
              fill={theme.accent}
              yAxisId={0}
              stroke={theme.accent}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  )
}
