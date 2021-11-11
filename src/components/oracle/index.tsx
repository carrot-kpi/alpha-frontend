import { ReactElement, useEffect, useState } from 'react'
import { Card } from '../card'
import { Title } from '../title'
import { Button, Flex, Text } from 'rebass'
import { ChainId, KpiToken } from '@carrot-kpi/sdk'

import { BigNumberInput } from 'big-number-input'
import { isScalarQuestion, numberToByte32 } from '../../utils'
import { INVALID_ANSWER_ID, NETWORK_DETAIL } from '../../constants'
import { useRealityQuestion } from '../../hooks/useRealityQuestion'
import Skeleton from 'react-loading-skeleton'
import { formatEther, formatUnits } from '@ethersproject/units'
import { Zero } from '@ethersproject/constants'
import styled from 'styled-components'
import { useNativeCurrency } from '../../hooks/useNativeCurrency'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { BigNumber } from 'ethers'
import { ExternalLink } from '../undecorated-link'

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
export const Oracle = ({
  kpi,
  realityQuestionFinalized,
}: {
  kpi: KpiToken | undefined
  realityQuestionFinalized: boolean
}): ReactElement => {
  const [isScalar, setIsScalar] = useState(true)
  const [loader, setLoader] = useState(true)
  const { submitAnswer, transactionLoader, currentQuestionData, getData } = useRealityQuestion(kpi?.kpiId)
  const { chainId } = useActiveWeb3React()

  const [bigNumberValue, setBigNumberValue] = useState('')
  const [radioValue, setRadioValue] = useState<RealityBinary>(RealityBinary.YES)
  const { decimals, symbol } = useNativeCurrency()

  useEffect(() => {
    if (!kpi) setLoader(true)
    else setIsScalar(isScalarQuestion(kpi.lowerBound, kpi.higherBound)), setLoader(false), getData()
  }, [kpi, getData])

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
      {realityQuestionFinalized ? (
        <>
          <Text>
            Reality.eth (
            <ExternalLink href={`https://reality.eth.link/app/#!/question/${kpi ? kpi.kpiId : ''}`}>
              see question
            </ExternalLink>
            )
          </Text>
          {currentQuestionData?.answer && (
            <Text color={'#979797'}>Finalized Answer {formatEther(currentQuestionData?.answer)}</Text>
          )}
        </>
      ) : (
        <>
          {isScalar ? (
            <>
              {loader ? (
                <Skeleton width={'158px'} height={'24px'} />
              ) : (
                <>
                  <BigNumberInput decimals={18} value={bigNumberValue} onChange={setBigNumberValue} />
                  {!currentQuestionData.bond.eq(Zero) && (
                    <AdditionalScalarData>
                      {formatUnits(currentQuestionData.bond, decimals)} {symbol} bonded on{' '}
                      {currentQuestionData.answer === INVALID_ANSWER_ID
                        ? 'Invalid'
                        : formatUnits(currentQuestionData.answer, 18)}
                    </AdditionalScalarData>
                  )}
                </>
              )}
            </>
          ) : (
            <form>
              {loader ? (
                <Flex flexDirection={'column'}>
                  <Skeleton width={'168px'} height={'35px'} />
                  <Skeleton width={'168px'} height={'35px'} />
                  <Skeleton width={'168px'} height={'35px'} />
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
                      {!currentQuestionData.bond.eq(Zero) &&
                        BigNumber.from(currentQuestionData.answer).isZero() &&
                        `${formatEther(currentQuestionData.bond)} ${symbol} Bonded`}
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
                      {!currentQuestionData.bond.eq(Zero) &&
                        BigNumber.from(currentQuestionData.answer).eq(BigNumber.from(1)) &&
                        `${formatEther(currentQuestionData.bond)} ${symbol} Bonded`}
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
                      {!currentQuestionData.bond.eq(Zero) &&
                        currentQuestionData.answer === INVALID_ANSWER_ID &&
                        `${formatEther(currentQuestionData.bond)} ${symbol} Bonded`}
                    </ExtraData>
                  </div>
                </>
              )}
            </form>
          )}
          {transactionLoader || loader ? (
            <>
              <Skeleton width={'139px'} height={'38px'} />
              {isScalar && <Skeleton width={'152px'} height={'38px'} />}
            </>
          ) : (
            <>
              <StyledSubmitButton
                backgroundColor="#FF782D"
                marginTop={'9px'}
                disabled={loader}
                onClick={() => {
                  intiaiteSubmit()
                }}
              >
                Bond{' '}
                {currentQuestionData.bond.gt(Zero)
                  ? `${formatUnits(currentQuestionData.bond.mul(2), decimals)} ${symbol}`
                  : `${formatEther(NETWORK_DETAIL[chainId ? chainId : ChainId.XDAI].defaultBond)} ${symbol}`}
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
                  {currentQuestionData.bond.gt(Zero)
                    ? `${formatUnits(currentQuestionData.bond.mul(2), decimals)} ${symbol}`
                    : `${formatEther(NETWORK_DETAIL[chainId ? chainId : ChainId.XDAI].defaultBond)} ${symbol}`}
                </StyledInvalidButton>
              )}
            </>
          )}
        </>
      )}
    </Card>
  )
}
