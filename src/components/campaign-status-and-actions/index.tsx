import { Status } from '../../pages/campaign'
import { UndecoratedExternalLink } from '../undecorated-link'
import { Flex, Box } from 'rebass'
import { KpiToken, Amount } from '@carrot-kpi/sdk'
import { ButtonMedium } from '../button'
import { useFinalizeKpiTokenCallback } from '../../hooks/useFinalizeKpiTokenCallback'
import { ZERO_DECIMAL } from '../../constants'
import { useRedeemKpiTokenCallback } from '../../hooks/useRedeemKpiTokenCallback'
import Skeleton from 'react-loading-skeleton'
import { Token } from '@usedapp/core'
import { useCallback } from 'react'

interface CampaignStatusAndActionsProps {
  status: Status | null
  kpiToken?: KpiToken
  kpiTokenBalance?: Amount<Token>
}

export const CampaignStatusAndActions = ({ status, kpiToken, kpiTokenBalance }: CampaignStatusAndActionsProps) => {
  const finalize = useFinalizeKpiTokenCallback(kpiToken)
  const redeem = useRedeemKpiTokenCallback(kpiToken)

  const handleFinalize = useCallback(() => {
    if (finalize) finalize()
  }, [finalize])

  const handleRedeem = useCallback(() => {
    if (redeem) redeem()
  }, [redeem])

  if (status === null) return <Skeleton width="100%" height="16px" />
  if (status === Status.AWAITING_EXPIRY)
    return (
      <>
        The condition still has to play out. Results will be known only after{' '}
        {kpiToken?.expiresAt.toFormat('dd/mm/yyyy hh:ss')} local time.
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
          <UndecoratedExternalLink href={`https://reality.eth.link/app/#!/question/${kpiToken?.kpiId}`}>
            <ButtonMedium>Submit answer</ButtonMedium>
          </UndecoratedExternalLink>
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
          <ButtonMedium onClick={handleFinalize}>Finalize KPI token</ButtonMedium>
        </Box>
      </Flex>
    )
  if (status === Status.KPI_REACHED && kpiTokenBalance && !kpiTokenBalance.isZero())
    return (
      <Flex flexDirection="column">
        <Box mb="20px">
          The KPI has been reached with {kpiToken?.progressPercentage.toFixed(2)}% completion rate.{' '}
          {kpiToken?.collateral.toFixed(4)} {kpiToken?.collateral.currency.ticker} have been unlocked and are redeemable
          by token holders in realtion to their balance.
        </Box>
        <Box>
          <ButtonMedium onClick={handleRedeem}>Redeem reward</ButtonMedium>
        </Box>
      </Flex>
    )
  if (status === Status.KPI_NOT_REACHED) {
    const kpiProgress = kpiToken?.progressPercentage
    if (kpiTokenBalance && !kpiTokenBalance.isZero() && kpiProgress && kpiProgress > ZERO_DECIMAL)
      return (
        <Flex flexDirection="column">
          <Box mb="20px">
            The KPI has been partly reached. {kpiProgress.toFixed(2)}% of the collateral has been unlocked for token
            holders to redeem. Click the button below to redeem your part.
          </Box>
          <Box>
            <ButtonMedium onClick={handleRedeem}>Redeem reward</ButtonMedium>
          </Box>
        </Flex>
      )
    return (
      <Flex flexDirection="column">
        <Box mb="20px">The KPI has not been reached. You can click the button below to burn your KPI tokens.</Box>
        <Box>
          <ButtonMedium onClick={handleRedeem}>Burn tokens</ButtonMedium>
        </Box>
      </Flex>
    )
  }
  return null
}