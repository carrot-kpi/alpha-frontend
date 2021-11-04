import { ReactElement, useEffect, useState } from 'react'
import { Card } from '../card'
import { Title } from '../title'
// import { ExternalLink } from '../undecorated-link'
// import { Text } from 'rebass'
import { Button, Flex } from 'rebass'
import { KpiToken } from '@carrot-kpi/sdk'

import {BigNumberInput} from 'big-number-input'
import { isScalarQuestion, numberToByte32 } from '../../utils'
import { INVALID_ANSWER_ID } from '../../constants'
import { useRealityQuestion } from '../../hooks/useRealityQuestion'
import Skeleton from 'react-loading-skeleton'
import { formatEther } from '@ethersproject/units'

enum RealityBinary{
  YES,
  NO,
}


export const Oracle = ({ kpi }: { kpi: KpiToken | undefined}): ReactElement => {
      const [isScalar,setIsScalar]=useState(true)
  const [loader,setLoader]=useState(true)
  const {submitAnswer, transactionLoader,currentBond}=useRealityQuestion(kpi?.kpiId)

  const [bigNumberValue,setBigNumberValue]=useState('')
  const [radioValue,setRadioValue]=useState<RealityBinary>(RealityBinary.YES)

  useEffect(()=>{
    if(!kpi) setLoader(true)
    else setIsScalar(isScalarQuestion(kpi.lowerBound,kpi.higherBound)),setLoader(false)

  },[kpi])


const handelRadioChange=(value:any)=>{
        const target=value.target.value
        setRadioValue(parseInt(target))
}
const intiaiteSubmit=async (isInvalid:boolean)=>{
  const answer =
     isInvalid
      ? INVALID_ANSWER_ID
      : numberToByte32(isScalar ?bigNumberValue : radioValue)
  const tx=await submitAnswer(answer)
  console.log(tx)



}
  return (
      <Card flexDirection="column" m="8px">

        <Title mb="8px">Oracle</Title>

        { isScalar?
    <>
      {loader?<Skeleton width={'80px'}/>:<BigNumberInput decimals={18} value={bigNumberValue} onChange={setBigNumberValue}/>}

            </>

        : <form>
            {loader?<Flex flexDirection={'column'}>
              <Skeleton width={'80px'}/>
              <Skeleton width={'80px'}/>
            </Flex>: <> <div className="form-check">
              <label>
              <input
              type="radio"
              name="react-tips"
              value={RealityBinary.YES}
              checked={radioValue===RealityBinary.YES}
              className="form-check-input"
              onChange={handelRadioChange}
              />
              Reached {formatEther(currentBond)}
              </label>
              </div>
              <div className="form-check">
              <label>
              <input
              type="radio"
              name="react-tips"
              value={RealityBinary.NO}
              className="form-check-input"
              checked={radioValue===RealityBinary.NO}
              onChange={handelRadioChange}
              />
              Not Reached
              </label>
              </div></>}
          </form>}
        {transactionLoader?<Skeleton width={'100%'}/>:
          <>
            <Button backgroundColor='#d66766' onClick={()=>{intiaiteSubmit(false)}}>Submit Answer</Button>
            <Button backgroundColor='#d66700' onClick={()=>{intiaiteSubmit(true)}}>Set Invalid</Button>
          </>}


      </Card>

  )
}
