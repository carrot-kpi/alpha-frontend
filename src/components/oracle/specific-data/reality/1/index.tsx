import { Reality1Data } from '@carrot-kpi/v1-sdk'

interface Reality1SpecificDataProps {
  data: Reality1Data
}

export const Reality1SpecificData = ({ data }: Reality1SpecificDataProps) => {
  return (
    <>
      <h3>Manual Reality.eth oracle data</h3>
      <ul>
        <li>Reality address: {data.realityAddress}</li>
        <li>Arbitrator address: {data.arbitratorAddress}</li>
        <li>Question: {data.question}</li>
        <li>Timeout: {data.timeout}</li>
        <li>Opening timestamp: {data.openingTimestamp}</li>
      </ul>
    </>
  )
}
