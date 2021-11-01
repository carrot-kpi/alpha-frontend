import { ReactElement, useState } from 'react'
import { Card } from '../card'
import { Title } from '../title'
// import { ExternalLink } from '../undecorated-link'
// import { Text } from 'rebass'
import {Button} from 'rebass'
import { KpiToken } from '@carrot-kpi/sdk'

import {BigNumberInput} from 'big-number-input'


// const StyledSlider=styled(Slider)`
// width:177px !important;
// `
export const Oracle = ({ kpi }: { kpi: KpiToken | undefined}): ReactElement => {
      const [isScalar,setIsScalar]=useState(true)
  // const [slider,setSlider]=useState({x:0})
  const [bigNumberValue,setBigNumberValue]=useState('')




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
                  value="option1"
                  checked={true}
                  className="form-check-input"
                />
                Option 1
              </label>
            </div>

            <div className="form-check">
              <label>
                <input
                  type="radio"
                  name="react-tips"
                  value="option2"
                  className="form-check-input"
                />
                Option 2
              </label>
            </div>

            <div className="form-check">
              <label>
                <input
                  type="radio"
                  name="react-tips"
                  value="option3"
                  className="form-check-input"
                />
                Option 3
              </label>
            </div>

            <div className="form-group">
              <button className="btn btn-primary mt-2" type="submit">
                Save
              </button>
            </div>

          </form>}
        <Button onClick={()=>{setIsScalar(!isScalar)}}>Submit Answer</Button>
      </Card>

  )
}
