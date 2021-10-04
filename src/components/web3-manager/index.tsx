import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { Flex, Card } from 'rebass'
import styled, { keyframes } from 'styled-components'
import { network } from '../../connectors'
import { NETWORK_CONTEXT_NAME } from '../../constants'
import { useEagerConnect } from '../../hooks/useEagerConnect'
import { useInactiveListener } from '../../hooks/useInactiveListener'
import { useTargetedChainIdFromUrl } from '../../hooks/useTargetedChainIdFromUrl'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledSVG = styled.svg<{ size: string; stroke?: string }>`
  animation: 2s ${rotate} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: ${({ stroke, theme }) => stroke ?? theme.accent};
  }
`

function Loader({ size = '16px', stroke, ...rest }: { size?: string; stroke?: string; [k: string]: any }) {
  return (
    <StyledSVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" size={size} stroke={stroke} {...rest}>
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSVG>
  )
}

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NETWORK_CONTEXT_NAME)
  const targetedChainId = useTargetedChainIdFromUrl()

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      if (targetedChainId && network.supportedChainIds && network.supportedChainIds.indexOf(targetedChainId) >= 0) {
        network.changeChainId(targetedChainId)
      }
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active, targetedChainId])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
        <Card>An unknown error occurred. Please refresh the page, or visit from another browser or device.</Card>
      </Flex>
    )
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
        <Loader />
      </Flex>
    ) : null
  }

  return children
}
