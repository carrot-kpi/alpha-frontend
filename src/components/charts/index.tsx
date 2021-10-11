import { Flex } from 'rebass'
import { Metric, PairLiquidityMetric, TokenPriceMetric, TvlMetric } from '../../constants/featured-campaigns/metrics'
import { Card } from '../card'
import { Title } from '../title'
import { BarChart } from './bar-chart'
import { AreaChart } from './area-chart'

interface ChartsProps {
  metrics: Metric[]
}

export const Charts = ({ metrics }: ChartsProps) => {
  return (
    <Flex flexDirection="column">
      {metrics.map((metric, index) => {
        return (
          <Card m="8px" key={index}>
            {(metric instanceof TvlMetric || metric instanceof PairLiquidityMetric) && (
              <>
                <Title mb="20px" fontWeight="700">
                  {metric.name}
                </Title>
                <BarChart metric={metric} />
              </>
            )}
            {metric instanceof TokenPriceMetric && (
              <>
                <Title mb="20px" fontWeight="700">
                  {metric.name}
                </Title>
                <AreaChart metric={metric} />
              </>
            )}
          </Card>
        )
      })}
    </Flex>
  )
}
