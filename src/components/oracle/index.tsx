import { ReactElement, useCallback, useMemo, useState } from 'react'
import { Box, Flex } from 'rebass'
import { Amount, ChainId, KpiToken } from '@carrot-kpi/sdk'

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
  const { data: questionData } = useRealityQuestion(kpiId)
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
  const bondButtonDisabled = useMemo(() => {
    if (loading) return true
    if (nativeCurrencyBalance.lt(minimumBond)) return true
    if (binary && !!radioValue && Number(radioValue) !== 0) return true
    if (!binary && (!scalarAnswer || isNaN(parseFloat(scalarAnswer)))) return true
    if (minimumBond.eq(0) && (!answerBond || parseUnits(answerBond, nativeCurrency.decimals).eq(0))) return true
    return false
  }, [
    answerBond,
    binary,
    minimumBond,
    nativeCurrency.decimals,
    nativeCurrencyBalance,
    radioValue,
    scalarAnswer,
    loading,
  ])
  const finalAnswer = useMemo(() => {
    if (binary && !!radioValue) return numberToByte32(radioValue)
    if (!binary && !!scalarAnswer && !isNaN(parseFloat(scalarAnswer)))
      return numberToByte32(parseUnits(scalarAnswer, 18).toString())
    return undefined
  }, [binary, radioValue, scalarAnswer])
  const finalBond = useMemo(() => {
    if (minimumBond.eq(0))
      return parseUnits(!!answerBond && !answerBond.endsWith('.') ? answerBond : '0', nativeCurrency.decimals)
    return minimumBond.raw
  }, [answerBond, minimumBond, nativeCurrency.decimals])
  const answer = useAnswerRealityQuestionCallback(kpiToken, finalAnswer, finalBond)

  const handleRadioChange = useCallback((value: any) => {
    setRadioValue(parseInt(value.target.value))
  }, [])

  const handleAnswer = useCallback(() => {
    setLoading(true)
    setAnswerBond('')
    setScalarAnswer('')
    setRadioValue(null)
    answer().finally(() => {
      setLoading(false)
    })
  }, [answer])

  if (questionData.arbitrating) {
    return (
      <>
        The KPI-related question is currently awaiting a final answer from{' '}
        <ExternalLink href={getExplorerLink(chainId || ChainId.XDAI, questionData.arbitrator, 'address')}>
          the arbitrator
        </ExternalLink>
        , after an arbitration request has been submitted by a user.
      </>
    )
  }
  return (
    <Flex flexDirection="column">
      <Box mb="12px">
        The KPI-related question is currently awaiting a final answer. If you know it, check out the form below to
        submit it.
      </Box>
      <Box mb="20px">
        In case an answer cannot be determined due to how the question was originally asked, you can also mark the KPI
        token as invalid altogether.
      </Box>
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
        <Box mb="12px" flex="1">
          <NumberInput placeholder="Answer" value={scalarAnswer} onChange={setScalarAnswer} />
        </Box>
      )}
      <Box mb="24px">
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
      </Box>
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
