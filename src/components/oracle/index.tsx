import { ReactElement, useEffect, useState } from 'react'
import { Card } from '../card'
import { Title } from '../title'
// import { ExternalLink } from '../undecorated-link'
// import { Text } from 'rebass'
import {Button} from 'rebass'
import { KpiToken } from '@carrot-kpi/sdk'

import {BigNumberInput} from 'big-number-input'
import { isScalarQuestion, numberToByte32 } from '../../utils'
import { INVALID_ANSWER_ID } from '../../constants'
import { useRealityQuestion } from '../../hooks/useRealityQuestion'

enum RealityBinary{
  YES,
  NO,
  INVALID
}

// const StyledSlider=styled(Slider)`
// width:177px !important;
// `
export const Oracle = ({ kpi }: { kpi: KpiToken | undefined}): ReactElement => {
      const [isScalar,setIsScalar]=useState(true)
  const [loading,setLoader]=useState(true)
  const {submitAnswer}=useRealityQuestion(kpi?.kpiId)
  // const [slider,setSlider]=useState({x:0})
  const [bigNumberValue,setBigNumberValue]=useState('')
  const [radioValue,setRadioValue]=useState<RealityBinary>(RealityBinary.YES)
  // console.log(kpi)
  // console.log(kpi && formatEther(kpi?.lowerBound),'lower bound')
  // console.log(kpi && formatEther(kpi?.higherBound),'upper bound')
  useEffect(()=>{
    if(!kpi) setLoader(true)
    else setIsScalar(isScalarQuestion(kpi.lowerBound,kpi.higherBound))

  },[kpi])


const handleChange=(value:any)=>{
        const target=value.target.value

  setRadioValue(parseInt(target))
        // setRadioValue(value)
}
console.log('loader',loading)
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
        {/*<Text>*/}
        {/*  Reality.eth (*/}
        {/*  <ExternalLink href={`https://reality.eth.link/app/#!/question/${kpiId}`}>see question</ExternalLink>)*/}
        {/*</Text>*/}
        {isScalar?
    <>
            {/*<StyledSlider styles={{*/}
            {/*  track: {*/}
            {/*    backgroundColor: '#d66700'*/}
            {/*  },*/}
            {/*  active: {*/}
            {/*    backgroundColor: 'red'*/}
            {/*  },*/}

            {/*  disabled: {*/}
            {/*    opacity: 0.5*/}
            {/*  }*/}
            {/*}} axis="x" x={slider.x}  onChange={handleSliderChange} />*/}
            <BigNumberInput decimals={18} value={bigNumberValue} onChange={setBigNumberValue}/>
            </>

        : <form>
            <div className="form-check">
              <label>
                <input
                  type="radio"
                  name="react-tips"
                  value={RealityBinary.YES}
                  checked={radioValue===RealityBinary.YES}
                  className="form-check-input"
                  onChange={handleChange}
                />
                Reached
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
                  onChange={handleChange}
                />
                Not Reached
              </label>
            </div>

          </form>}
        <Button backgroundColor='#d66700' onClick={()=>{intiaiteSubmit(true)}}>Set Invalid</Button>
        <Button backgroundColor='#d66766' onClick={()=>{intiaiteSubmit(false)}}>Submit Answer</Button>
        <Button backgroundColor='#d66700' onClick={()=>{setIsScalar(!isScalar)}}>Change Question Type</Button>
      </Card>

  )
}