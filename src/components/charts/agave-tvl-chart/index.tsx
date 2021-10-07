import { XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts'
import styled, { useTheme } from 'styled-components'
import { DateTime } from 'luxon'
import { commify } from '@ethersproject/units'
import Decimal from 'decimal.js-light'
import { useAgaveTvlDayData } from '../../../hooks/useAgaveTvlDayData'
import { Box, Flex } from 'rebass'

const ChartContainer = styled.div`
  height: 300px;
`

interface AgaveTvlChartProps {
  startDate: DateTime
  endDate: DateTime
}

export const AgaveTvlChart = ({ startDate, endDate }: AgaveTvlChartProps) => {
  const theme = useTheme()
  const { loading, data } = useAgaveTvlDayData(startDate, endDate)

  return (
    <ChartContainer>
      {loading ? (
        <Flex height="100%" justifyContent="center" alignItems="center">
          <Box>Loading</Box>
        </Flex>
      ) : (
        data.length > 0 && (
          <ResponsiveContainer>
            <BarChart barCategoryGap={1} data={data}>
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
              <YAxis type="number" axisLine={false} interval="preserveEnd" allowDataOverflow yAxisId={0} tick={false} />
              <Tooltip
                cursor={{ fill: theme.border }}
                formatter={(val: string) => `$${commify(new Decimal(val).toFixed(2))}`}
                labelFormatter={(label) => DateTime.fromSeconds(label).toFormat('DD')}
                labelStyle={{ paddingTop: 4 }}
                contentStyle={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  borderColor: theme.border,
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px',
                  color: 'black',
                }}
              />
              <Bar
                type="monotone"
                name={'Liquidity'}
                dataKey={'tvlUSD'}
                fill={theme.accent}
                yAxisId={0}
                stroke={theme.accent}
              />
            </BarChart>
          </ResponsiveContainer>
        )
      )}
    </ChartContainer>
  )
}
