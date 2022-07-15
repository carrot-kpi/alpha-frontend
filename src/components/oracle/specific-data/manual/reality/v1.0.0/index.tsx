import { ManualRealityV100Data } from '@carrot-kpi/v1-sdk'

interface ManualRealityV100SpecificDataProps {
  data: ManualRealityV100Data
}

export const ManualRealityV100SpecificData = ({ data }: ManualRealityV100SpecificDataProps) => {
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
