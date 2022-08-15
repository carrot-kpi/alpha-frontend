import { Reality1Data } from '@carrot-kpi/v1-sdk'
import { DateTime } from 'luxon'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'
import { useFinalizeOracleCallback } from '../../../../../hooks/useFinalizeOracleCallback'
import { useIsOracleFinalized } from '../../../../../hooks/useIsOracleFinalized'
import { useIsRealityQuestionFinalized } from '../../../../../hooks/useIsRealityQuestionFinalized'
import { ExternalLink } from '../../../../undecorated-link'

const ErrorText = styled.span`
  color: ${(props) => props.theme.red};
`

export enum RealityQuestionStatus {
  AWAITING_OPENING,
  AWAITING_ANSWER,
  AWAITING_FINALIZATION,
  FINALIZED,
}

interface Reality1ActionProps {
  address: string
  data: Reality1Data
}

export const Reality1Action = ({ address, data }: Reality1ActionProps) => {
  const realityQuestionId = useMemo(() => data.questionId, [data.questionId])
  const { loading: loadingRealityQuestionFinalized, finalized: realityQuestionFinalized } =
    useIsRealityQuestionFinalized(realityQuestionId)
  const { loading: loadingOracleFinalized, finalized: oracleFinalized } = useIsOracleFinalized(address)
  const finalizeOracle = useFinalizeOracleCallback(address)

  const [realityQuestionStatus, setRealityQuestionStatus] = useState(RealityQuestionStatus.AWAITING_ANSWER)

  useEffect(() => {
    if (loadingRealityQuestionFinalized || loadingOracleFinalized) return
    const openForAnswers = data.openingTimestamp * 1000 <= Date.now()
    if (!openForAnswers) setRealityQuestionStatus(RealityQuestionStatus.AWAITING_OPENING)
    else if (realityQuestionFinalized) {
      if (oracleFinalized) setRealityQuestionStatus(RealityQuestionStatus.FINALIZED)
      else setRealityQuestionStatus(RealityQuestionStatus.AWAITING_FINALIZATION)
    } else setRealityQuestionStatus(RealityQuestionStatus.AWAITING_ANSWER)
  }, [
    data.openingTimestamp,
    loadingOracleFinalized,
    loadingRealityQuestionFinalized,
    oracleFinalized,
    realityQuestionFinalized,
  ])

  const handleFinalize = useCallback(() => {
    if (finalizeOracle) finalizeOracle()
  }, [finalizeOracle])

  if (realityQuestionStatus === RealityQuestionStatus.AWAITING_OPENING) {
    return (
      <>
        <h3>Manual Reality.eth oracle actions</h3>
        The condition still has to play out. The oracle will become answerable only after{' '}
        {DateTime.fromSeconds(data.openingTimestamp).toFormat('dd/MM/yyyy HH:ss')} local time. Reality.eth is a{' '}
        <ErrorText>manually</ErrorText> crowdsourced oracle supporting arbitration, so answers have to be submitted{' '}
        <ErrorText>manually</ErrorText>. Read more about Reality.eth in the{' '}
        <ExternalLink showIcon href="https://reality.eth.limo/app/docs/html/index.html">
          official docs
        </ExternalLink>
        .
      </>
    )
  }
  if (realityQuestionStatus === RealityQuestionStatus.AWAITING_FINALIZATION)
    return (
      <>
        <h3>Manual Reality.eth oracle actions</h3>
        <Flex flexDirection="column">
          <Box mb="20px">
            The KPI token is ready to be finalized. In case the KPI was reached, this will unlock the underlying
            collateral to be distributed among token holders in relation to their balance.
          </Box>
          <Box>
            <button onClick={handleFinalize}>Finalize KPI token</button>
          </Box>
        </Flex>
      </>
    )
  if (realityQuestionStatus === RealityQuestionStatus.AWAITING_ANSWER)
    return (
      <>
        <h3>Manual Reality.eth oracle actions</h3>
        <>
          <ExternalLink
            showIcon
            href={`https://reality.eth.limo/app/#!/question/#!/question/${data.realityAddress}-${realityQuestionId}`}
          >
            Click here
          </ExternalLink>{' '}
          to answer the question on Reality.eth. .
        </>
      </>
    )
  return (
    <>
      <h3>Manual Reality.eth oracle actions</h3>
      Question finalized
    </>
  )
}
