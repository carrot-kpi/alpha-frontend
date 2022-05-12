import { Status } from '../../pages/campaign'
import { Flex, Box } from 'rebass'
import { Amount, Token } from '@carrot-kpi/sdk-core'
import { KpiToken } from '@carrot-kpi/alpha-sdk'
import { Button } from '../button'
import { useFinalizeKpiTokenCallback } from '../../hooks/useFinalizeKpiTokenCallback'
import { ZERO_DECIMAL } from '../../constants'
import { useRedeemKpiTokenCallback } from '../../hooks/useRedeemKpiTokenCallback'
import Skeleton from 'react-loading-skeleton'
import { useCallback, useMemo } from 'react'
import Decimal from 'decimal.js-light'
import { Oracle } from '../oracle'
import { useBurnKpiTokenCallback } from '../../hooks/useBurnKpiTokenCallback'

interface CampaignStatusAndActionsProps {
  status: Status | null
  kpiToken?: KpiToken
  kpiTokenBalance?: Amount<Token>
  kpiProgressPercentage: Decimal
}

export const CampaignStatusAndActions = ({
  status,
  kpiToken,
  kpiTokenBalance,
  kpiProgressPercentage,
}: CampaignStatusAndActionsProps) => {
  const finalize = useFinalizeKpiTokenCallback(kpiToken)
  const redeem = useRedeemKpiTokenCallback(kpiToken)
  const burn = useBurnKpiTokenCallback(kpiToken)
  const hasBalance = useMemo(() => kpiTokenBalance && !kpiTokenBalance.isZero(), [kpiTokenBalance])

  const handleFinalize = useCallback(() => {
    if (finalize) finalize()
  }, [finalize])

  const handleRedeem = useCallback(() => {
    if (redeem) redeem()
  }, [redeem])

  const handleBurn = useCallback(() => {
    if (burn) burn()
  }, [burn])

  if (status === null) return <Skeleton width="100%" height="16px" />
  if (status === Status.AWAITING_EXPIRY)
    return (
      <>
        The condition still has to play out. Results will be known only after{' '}
        {kpiToken?.expiresAt.toFormat('dd/MM/yyyy HH:ss')} local time.
      </>
    )
  if (status === Status.AWAITING_ANSWER) return <Oracle kpiToken={kpiToken} />
  if (status === Status.AWAITING_FINALIZATION)
    return (
      <Flex flexDirection="column">
        <Box mb="20px">
          The KPI token is ready to be finalized. In case the KPI was reached, this will unlock the underlying
          collateral to be distributed among token holders in relation to their balance.
        </Box>
        <Box>
          <Button primary onClick={handleFinalize}>
            Finalize KPI token
          </Button>
        </Box>
      </Flex>
    )
  if (status === Status.KPI_REACHED)
    return (
      <Flex flexDirection="column">
        <Box>
          The KPI has been reached with {kpiProgressPercentage.toFixed(2)}% completion rate.{' '}
          {kpiToken?.collateral.toFixed(4)} {kpiToken?.collateral.currency.symbol} have been unlocked and are redeemable
          by token holders in relation to their balance.
          {hasBalance ? ' Click the button below to redeem your part.' : ''}
        </Box>
        {hasBalance && (
          <Box mt="20px">
            <Button primary onClick={handleRedeem}>
              Redeem reward
            </Button>
          </Box>
        )}
      </Flex>
    )
  if (status === Status.KPI_NOT_REACHED) {
    if (kpiProgressPercentage.greaterThan(ZERO_DECIMAL))
      return (
        <Flex flexDirection="column">
          <Box>
            The KPI has been partly reached. {kpiProgressPercentage.toFixed(2)}% of the collateral has been unlocked for
            token holders to redeem.{hasBalance ? ' Click the button below to redeem your part.' : ''}
          </Box>
          {hasBalance && (
            <Box mt="20px">
              <Button primary onClick={handleRedeem}>
                Redeem reward
              </Button>
            </Box>
          )}
        </Flex>
      )
    return (
      <Flex flexDirection="column">
        <Box>
          The KPI has not been reached.
          {hasBalance ? ' If you want, you can click the button below to burn your KPI tokens.' : ''}
        </Box>
        {hasBalance && (
          <Box mt="20px">
            <Button primary onClick={handleBurn}>
              Burn tokens
            </Button>
          </Box>
        )}
      </Flex>
    )
  }
  return null
}
