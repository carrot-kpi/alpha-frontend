import { Token } from '@carrot-kpi/sdk-core'
import { Erc20V100Data } from '@carrot-kpi/v1-sdk'
import { defaultAbiCoder } from '@ethersproject/abi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from '../../../../../hooks/useActiveWeb3React'
import { useERC20TokenBalance } from '../../../../../hooks/useERC20TokenBalance'
import { useIsKpiTokenExpired } from '../../../../../hooks/useIsKpiTokenExpired'
import { useIsKpiTokenFinalized } from '../../../../../hooks/useIsKpiTokenFinalized'
import { useRedeemKpiTokenCallback } from '../../../../../hooks/useRedeemKpiTokenCallback'

interface Erc20V100ActionProps {
  address: string
  data: Erc20V100Data
}

export const Erc20V100Action = ({ address, data }: Erc20V100ActionProps) => {
  const { chainId, account } = useActiveWeb3React()
  const { loading: loadingFinalized, finalized } = useIsKpiTokenFinalized(address)
  const { loading: loadingExpired, expired } = useIsKpiTokenExpired(address)
  const erc20Token = useMemo(
    () => (chainId ? new Token(chainId, address, 18, data.symbol, data.name) : undefined),
    [address, chainId, data.name, data.symbol]
  )
  const { loading: loadingKpiTokenBalance, balance: erc20Balance } = useERC20TokenBalance(erc20Token)
  const redeemData = useMemo(() => defaultAbiCoder.encode(['address'], [address]), [address])
  const redeem = useRedeemKpiTokenCallback(address, redeemData)

  const [somethingToRedeem, setSomethingToRedeem] = useState(false)

  useEffect(() => {
    if (loadingFinalized || loadingExpired || loadingKpiTokenBalance) return
    if (!finalized && !expired) setSomethingToRedeem(false)
    if (!account || !erc20Balance || erc20Balance.isZero()) setSomethingToRedeem(false)
    if (data.collaterals.some((collateral) => collateral.minimumPayout.isPositive())) {
      setSomethingToRedeem(true)
    }
    setSomethingToRedeem(data.oracles.some((oracle) => oracle.finalResult.gt(oracle.lowerBound)))
  }, [
    account,
    data.collaterals,
    data.oracles,
    erc20Balance,
    expired,
    finalized,
    loadingExpired,
    loadingFinalized,
    loadingKpiTokenBalance,
  ])

  const handleRedeem = useCallback(() => {
    if (redeem) redeem()
  }, [redeem])

  if (!account) {
    return (
      <>
        <h3>ERC20 KPI token actions</h3>
        Connect wallet to check out actions
      </>
    )
  }
  if (!finalized && !expired) {
    return (
      <>
        <h3>ERC20 KPI token actions</h3>
        <p>KPI token balance: {loadingKpiTokenBalance || !erc20Balance ? 'Loading...' : erc20Balance.toString()}</p> No
        action possible
      </>
    )
  }
  if (!!erc20Balance && erc20Balance.isZero()) {
    return (
      <>
        <h3>ERC20 KPI token actions</h3>
        <p>KPI token balance: {loadingKpiTokenBalance || !erc20Balance ? 'Loading...' : erc20Balance.toString()}</p> No
        action possible
      </>
    )
  }
  return (
    <>
      <h3>Manual Reality.eth oracle actions</h3>
      <p>KPI token balance: {loadingKpiTokenBalance || !erc20Balance ? 'Loading...' : erc20Balance.toString()}</p>
      <button onClick={handleRedeem}>{somethingToRedeem ? 'Redeem collateral' : 'Burn KPI tokens'}</button>
    </>
  )
}
