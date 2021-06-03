import { ReactElement } from 'react'
import { Flex } from 'rebass'
import { RouteComponentProps } from 'react-router-dom'
import { useKpiToken } from '../../hooks/useKpiToken'

export function Campaign({
  match: {
    params: { kpiId },
  },
}: RouteComponentProps<{ kpiId: string }>): ReactElement {
  const { kpiToken, loading: loadingKpiToken } = useKpiToken(kpiId)

  return (
    <Flex flexDirection="column">
      {loadingKpiToken}
      {kpiToken?.address}
    </Flex>
  )
}
