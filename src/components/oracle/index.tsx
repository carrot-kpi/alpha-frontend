import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Flex, Text } from 'rebass'
import { Amount, ChainId } from '@carrot-kpi/sdk-core'
import { KpiToken } from '@carrot-kpi/alpha-sdk'

import { INVALID_REALITY_ANSWER } from '../../constants'
import { useRealityQuestion } from '../../hooks/useRealityQuestion'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { Zero } from '@ethersproject/constants'
import styled from 'styled-components'
import { useNativeCurrency } from '../../hooks/useNativeCurrency'
import { Button } from '../button'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useNativeCurrencyBalance } from '../../hooks/useNativeCurrencyBalance'
import { NumberInput } from '../input/number'
import { useAnswerRealityQuestionCallback } from '../../hooks/useAnswerRealityQuestionCallback'
import { getExplorerLink, numberToByte32 } from '../../utils'
import { ExternalLink } from '../undecorated-link'
import Skeleton from 'react-loading-skeleton'
import { BigNumber } from '@ethersproject/bignumber'

enum RealityBinary {
  YES,
  NO,
  INVALID,
}

const StyledLabel = styled.label`
  margin-left: 7px;
`

export const Oracle = ({ kpiToken }: { kpiToken?: KpiToken }): ReactElement => {
  const { chainId, account } = useActiveWeb3React()
  const kpiId = useMemo(() => kpiToken?.kpiId, [kpiToken?.kpiId])
  const { loading: loadingRealityQuestionData, data: questionData } = useRealityQuestion(kpiId)
  const nativeCurrency = useNativeCurrency()
  const { balance: nativeCurrencyBalance } = useNativeCurrencyBalance(account)
  const currentAnswerInvalid = useMemo(() => {
    return !questionData.bond.eq(Zero) && questionData.answer.eq(INVALID_REALITY_ANSWER)
  }, [questionData.answer, questionData.bond])
  const minimumBond = useMemo(
    () => new Amount(nativeCurrency, questionData.bond.mul(2)),
    [nativeCurrency, questionData.bond]
  )
  const binary = useMemo(() => kpiToken && kpiToken.lowerBound.eq('0') && kpiToken.higherBound.eq('1'), [kpiToken])
  const [answerBond, setAnswerBond] = useState('')
  const [scalarAnswer, setScalarAnswer] = useState('')
  const [radioValue, setRadioValue] = useState<RealityBinary | null>(null)
  const [loading, setLoading] = useState(false)
  const [finalAnswer, setFinalAnswer] = useState('')
  const bondButtonDisabled = useMemo(() => {
    if (loading) return true
    if (nativeCurrencyBalance.lt(minimumBond)) return true
    if (
      binary &&
      radioValue !== RealityBinary.YES &&
      radioValue !== RealityBinary.NO &&
      radioValue !== RealityBinary.INVALID
    )
      return true
    if (
      !binary &&
      finalAnswer !== INVALID_REALITY_ANSWER.toHexString() &&
      (!scalarAnswer || isNaN(parseFloat(scalarAnswer)))
    )
      return true
    const parsedAnswerBond = new Amount(
      nativeCurrency,
      answerBond ? parseUnits(answerBond, nativeCurrency.decimals) : BigNumber.from(0)
    )
    if (nativeCurrencyBalance.lt(parsedAnswerBond)) return true
    if (minimumBond.eq(0) && parsedAnswerBond.eq(0)) return true
    return false
  }, [
    loading,
    nativeCurrencyBalance,
    minimumBond,
    binary,
    radioValue,
    finalAnswer,
    scalarAnswer,
    nativeCurrency,
    answerBond,
  ])
  const finalBond = useMemo(() => {
    if (minimumBond.eq(0))
      return parseUnits(!!answerBond && !answerBond.endsWith('.') ? answerBond : '0', nativeCurrency.decimals)
    return minimumBond.raw
  }, [answerBond, minimumBond, nativeCurrency.decimals])
  const questionId = useMemo(() => kpiToken?.kpiId, [kpiToken?.kpiId])
  const answer = useAnswerRealityQuestionCallback(questionId, finalAnswer, finalBond)

  useEffect(() => {
    if (binary && radioValue === RealityBinary.YES) setFinalAnswer(numberToByte32(1))
    else if (binary && radioValue === RealityBinary.NO) setFinalAnswer(numberToByte32(0))
    else if (binary && radioValue === RealityBinary.INVALID) setFinalAnswer(INVALID_REALITY_ANSWER.toHexString())
    else if (!binary && !!scalarAnswer && !isNaN(parseFloat(scalarAnswer)))
      setFinalAnswer(numberToByte32(parseUnits(scalarAnswer, 18).toString()))
    else if (finalAnswer !== INVALID_REALITY_ANSWER.toHexString()) setFinalAnswer('')
  }, [binary, finalAnswer, radioValue, scalarAnswer])

  const handleRadioChange = useCallback((value: any) => {
    setRadioValue(parseInt(value.target.value))
  }, [])

  const handleAnswer = useCallback(() => {
    setLoading(true)
    answer().finally(() => {
      setLoading(false)
      setAnswerBond('')
      setScalarAnswer('')
      setRadioValue(null)
    })
  }, [answer])

  const handleMarkInvalid = useCallback(() => {
    setScalarAnswer('')
    setFinalAnswer(numberToByte32(INVALID_REALITY_ANSWER.toString()))
  }, [])

  const handleMarkValid = useCallback(() => {
    setScalarAnswer('')
    setFinalAnswer('')
  }, [])

  if (loadingRealityQuestionData) {
    return <Skeleton width="100%" height="16px" />
  }
  if (questionData.arbitrating) {
    return (
      <>
        The KPI-related condition is currently awaiting a final answer from{' '}
        <ExternalLink href={getExplorerLink(chainId || ChainId.GNOSIS, questionData.arbitrator, 'address')} showIcon>
          the arbitrator
        </ExternalLink>
        , after an arbitration request has been submitted by a user.
      </>
    )
  }
  return (
    <Flex flexDirection="column">
      <Text mb="8px">
        The KPI-related condition is currently awaiting a final answer. If you know it, check out the form below to
        submit it.
      </Text>
      <Text mb="8px">
        In case an answer cannot be determined/calculated due to how the condition was originally framed or due to
        missing details, you can also mark the KPI token as invalid altogether.
      </Text>
      <Text mb="20px">
        Reality.eth is used as a crowdsourced oracle. You can check out how Reality.eth works by clicking{' '}
        <ExternalLink showIcon href="https://reality.eth.link/app/docs/html/index.html">
          here
        </ExternalLink>
        .
      </Text>
      {binary ? (
        <>
          <Box>
            <input
              type="radio"
              name="react-tips"
              value={RealityBinary.YES}
              checked={radioValue === RealityBinary.YES}
              disabled={questionData.bond.gt(0) && questionData.answer.eq(1)}
              onChange={handleRadioChange}
            />
            <StyledLabel>Goal reached</StyledLabel>
          </Box>
          <Box>
            <input
              type="radio"
              name="react-tips"
              value={RealityBinary.NO}
              checked={radioValue === RealityBinary.NO}
              disabled={questionData.bond.gt(0) && questionData.answer.eq(0)}
              onChange={handleRadioChange}
            />
            <StyledLabel>Goal not reached</StyledLabel>
          </Box>
          <Box mb="12px">
            <input
              type="radio"
              name="react-tips"
              value={RealityBinary.INVALID}
              checked={radioValue === RealityBinary.INVALID}
              disabled={questionData.bond.gt(0) && questionData.answer.eq(INVALID_REALITY_ANSWER)}
              onChange={handleRadioChange}
            />
            <StyledLabel>Invalid goal</StyledLabel>
          </Box>
        </>
      ) : (
        <Flex mb="8px">
          <Box flex="1">
            <NumberInput
              placeholder={finalAnswer === INVALID_REALITY_ANSWER.toHexString() ? 'Marked as invalid' : 'Answer'}
              disabled={finalAnswer === INVALID_REALITY_ANSWER.toHexString()}
              value={scalarAnswer}
              onChange={setScalarAnswer}
            />
          </Box>
          {!currentAnswerInvalid && (
            <Button
              ml="12px"
              primary
              onClick={finalAnswer === INVALID_REALITY_ANSWER.toHexString() ? handleMarkValid : handleMarkInvalid}
            >
              {finalAnswer === INVALID_REALITY_ANSWER.toHexString() ? 'Mark valid' : 'Mark invalid'}
            </Button>
          )}
        </Flex>
      )}
      <Text fontSize="12px" mb="24px">
        {questionData.bond.isZero()
          ? 'No answer submitted yet'
          : currentAnswerInvalid
          ? `Goal currently market as invalid with ${formatUnits(questionData.bond, nativeCurrency.decimals)} ${
              nativeCurrency.symbol
            } bonded`
          : `Currently submitted answer: ${
              !binary
                ? formatUnits(questionData.answer, 18)
                : questionData.answer.eq('1')
                ? 'goal reached'
                : 'goal not reached'
            } (${formatUnits(questionData.bond, nativeCurrency.decimals)} ${nativeCurrency.symbol} bonded)`}
      </Text>
      <Flex>
        {minimumBond.eq('0') && (
          <Box mr="12px" flex="1">
            <NumberInput placeholder="Bond" value={answerBond} onChange={setAnswerBond} />
          </Box>
        )}
        <Button primary disabled={bondButtonDisabled} onClick={handleAnswer}>
          Bond {minimumBond.eq(0) ? answerBond : formatUnits(minimumBond.raw, nativeCurrency.decimals)}{' '}
          {nativeCurrency.symbol}
        </Button>
      </Flex>
    </Flex>
  )
}
