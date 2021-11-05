import { ReactElement, useEffect, useState } from 'react'
import { Card } from '../card'
import { Title } from '../title'
import { Button, Flex } from 'rebass'
import { KpiToken } from '@carrot-kpi/sdk'

import { BigNumberInput } from 'big-number-input'
import { isScalarQuestion, numberToByte32 } from '../../utils'
import { INVALID_ANSWER_ID } from '../../constants'
import { useRealityQuestion } from '../../hooks/useRealityQuestion'
import Skeleton from 'react-loading-skeleton'
import { formatEther, formatUnits } from '@ethersproject/units'
import { Zero } from '@ethersproject/constants'
import styled from 'styled-components'
import { useNativeCurrency } from '../../hooks/useNativeCurrency'

enum RealityBinary {
  YES,
  NO,
  INVALID,
}
const ExtraData = styled.div`
  position: relative;
  left: 28px;
  font-weight: 500;
  color: #979797;
  font-size: 9px;
  margin-bottom: 9px;
`
const StyledLabel = styled.label`
  margin-left: 7px;
`
const StyledSubmitButton = styled(Button)`
  border-radius: 6px !important;
  font-weight: 700;
  font-size: 14px;
`
const StyledInvalidButton = styled(StyledSubmitButton)`
  border: 1px solid #ff782d !important;
`
const AdditionalScalarData = styled(ExtraData)`
  margin-top: 5px;
`
export const Oracle = ({ kpi }: { kpi: KpiToken | undefined }): ReactElement => {
  const [isScalar, setIsScalar] = useState(true)
  const [loader, setLoader] = useState(true)
  const { submitAnswer, transactionLoader, currentAnswer } = useRealityQuestion(kpi?.kpiId)

  const [bigNumberValue, setBigNumberValue] = useState('')
  const [radioValue, setRadioValue] = useState<RealityBinary>(RealityBinary.YES)
  const { decimals, symbol } = useNativeCurrency()

  useEffect(() => {
    if (!kpi) setLoader(true)
    else setIsScalar(isScalarQuestion(kpi.lowerBound, kpi.higherBound)), setLoader(false)
  }, [kpi])

  const handelRadioChange = (value: any) => {
    const target = value.target.value
    setRadioValue(parseInt(target))
  }
  const intiaiteSubmit = async (isInvalid = false) => {
    const answer =
      isInvalid || radioValue === RealityBinary.INVALID
        ? INVALID_ANSWER_ID
        : numberToByte32(isScalar ? bigNumberValue : radioValue)
    await submitAnswer(answer)
  }
  return (
    <Card flexDirection="column" m="8px">
      <Title mb="8px">Oracle</Title>

      {isScalar ? (
        <>
          {loader ? (
            <Skeleton width={'80px'} />
          ) : (
            <>
              <BigNumberInput decimals={18} value={bigNumberValue} onChange={setBigNumberValue} />
              {!currentAnswer.bond.eq(Zero) && (
                <AdditionalScalarData>
                  {formatUnits(currentAnswer.bond, decimals)} {symbol} bonded on{' '}
                  {currentAnswer.answer === INVALID_ANSWER_ID ? 'Invalid' : formatEther(currentAnswer.answer)}
                </AdditionalScalarData>
              )}
            </>
          )}
        </>
      ) : (
        <form>
          {loader ? (
            <Flex flexDirection={'column'}>
              <Skeleton width={'80px'} />
              <Skeleton width={'80px'} />
            </Flex>
          ) : (
            <>
              <div>
                <input
                  type="radio"
                  name="react-tips"
                  value={RealityBinary.YES}
                  checked={radioValue === RealityBinary.YES}
                  onChange={handelRadioChange}
                />
                <StyledLabel>Reached</StyledLabel>

                <ExtraData>
                  {!currentAnswer.bond.eq(Zero) &&
                    currentAnswer.answer === '0x0000000000000000000000000000000000000000000000000000000000000000' &&
                    `${formatEther(currentAnswer.bond)} ${symbol} Bonded`}
                </ExtraData>
              </div>
              <div>
                <input
                  type="radio"
                  name="react-tips"
                  value={RealityBinary.NO}
                  checked={radioValue === RealityBinary.NO}
                  onChange={handelRadioChange}
                />
                <StyledLabel>Not Reached</StyledLabel>

                <ExtraData>
                  {!currentAnswer.bond.eq(Zero) &&
                    currentAnswer.answer === '0x0000000000000000000000000000000000000000000000000000000000000001' &&
                    `${formatEther(currentAnswer.bond)} ${symbol} Bonded`}
                </ExtraData>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="react-tips"
                  value={RealityBinary.INVALID}
                  checked={radioValue === RealityBinary.INVALID}
                  onChange={handelRadioChange}
                />

                <StyledLabel>Invalid</StyledLabel>

                <ExtraData>
                  {!currentAnswer.bond.eq(Zero) &&
                    currentAnswer.answer === INVALID_ANSWER_ID &&
                    `${formatEther(currentAnswer.bond)} ${symbol} Bonded`}
                </ExtraData>
              </div>
            </>
          )}
        </form>
      )}
      {transactionLoader ? (
        <Skeleton width={'100%'} />
      ) : (
        <>
          <StyledSubmitButton
            backgroundColor="#FF782D"
            marginTop={'9px'}
            onClick={() => {
              intiaiteSubmit()
            }}
          >
            Bond{' '}
            {currentAnswer.bond.gt(Zero)
              ? `${formatUnits(currentAnswer.bond.mul(2), decimals)} ${symbol}`
              : `0.01 ${symbol}`}
          </StyledSubmitButton>
          {isScalar && (
            <StyledInvalidButton
              color="#FF782D"
              marginTop={'9px'}
              backgroundColor="white"
              onClick={() => {
                intiaiteSubmit(true)
              }}
            >
              Invalid{' '}
              {currentAnswer.bond.gt(Zero)
                ? `${formatUnits(currentAnswer.bond.mul(2), decimals)} ${symbol}`
                : `0.01 ${symbol}`}
            </StyledInvalidButton>
          )}
        </>
      )}
    </Card>
  )
}
