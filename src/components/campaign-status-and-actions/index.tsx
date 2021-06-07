import { Status } from '../../pages/campaign'
import { UndecoratedExternalLink } from '../undecorated-link'
import { Flex, Box } from 'rebass'
import { KpiToken } from 'carrot-sdk'
import { ButtonMedium } from '../button'
import { useFinalizeKpiTokenCallback } from '../../hooks/useFinalizeKpiTokenCallback'
import { ZERO_DECIMAL } from '../../constants'
import { useRedeemKpiTokenCallback } from '../../hooks/useRedeemKpiTokenCallback'
import Skeleton from 'react-loading-skeleton'

interface CampaignStatusAndActionsProps {
  status: Status | null
  kpiToken?: KpiToken
}

export const CampaignStatusAndActions = ({ status, kpiToken }: CampaignStatusAndActionsProps) => {
  const finalize = useFinalizeKpiTokenCallback(kpiToken)
  const redeem = useRedeemKpiTokenCallback(kpiToken)

  if (status === null) return <Skeleton width="100%" height="16px" />
  if (status === Status.AWAITING_EXPIRY)
    return (
      <>
        The condition still has to play out. Results will be known only after{' '}
        {kpiToken?.expiresAt.toFormat('dd/mm/yyyy hh:ss')}.
      </>
    )
  if (status === Status.AWAITING_ANSWER)
    return (
      <Flex flexDirection="column">
        <Box mb="20px">
          The KPI-related question is currently awaiting an answer on Reality.eth. If you know the answer, click the
          button below to submit it and receive a reward for your services.
        </Box>
        <Box>
          <ButtonMedium
            as={UndecoratedExternalLink}
            href={`https://reality.eth.link/app/#!/question/${kpiToken?.kpiId}`}
          >
            Submit answer
          </ButtonMedium>
        </Box>
      </Flex>
    )
  if (status === Status.AWAITING_FINALIZATION)
    return (
      <Flex flexDirection="column">
        <Box mb="20px">
          The KPI token is ready to be finalized. In case the KPI was reached, this will unlock the underlying
          collateral to be distributed among token holders in relation to their balance.
        </Box>
        <Box>
          <ButtonMedium onClick={finalize}>Finalize KPI token</ButtonMedium>
        </Box>
      </Flex>
    )
  if (status === Status.KPI_REACHED)
    return (
      <Flex flexDirection="column">
        <Box mb="20px">
          The KPI has been reached with {kpiToken?.progressPercentage.toFixed(2)}% completion rate.{' '}
          {kpiToken?.collateral.toFixed(4)} {kpiToken?.collateral.token.symbol} have been unlocked and are redeemable by
          token holders in realtion to their balance.
        </Box>
        <Box>
          <ButtonMedium onClick={finalize}>Redeem reward</ButtonMedium>
        </Box>
      </Flex>
    )
  if (status === Status.KPI_NOT_REACHED) {
    const kpiProgress = kpiToken?.progressPercentage
    if (kpiProgress && kpiProgress > ZERO_DECIMAL)
      return (
        <Flex flexDirection="column">
          <Box mb="20px">
            The KPI has been partly reached. {kpiProgress.toFixed(2)}% of the collateral has been unlocked for token
            holders to redeem. Click the button below to redeem your part.
          </Box>
          <Box>
            <ButtonMedium onClick={redeem}>Redeem reward</ButtonMedium>
          </Box>
        </Flex>
      )
    return <>The KPI has not been reached.</>
  }
  return null
}
