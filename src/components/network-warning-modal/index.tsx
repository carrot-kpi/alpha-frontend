import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Modal } from '../modal'
import { NETWORK_DETAIL } from '../../constants'
import { useTargetedChainIdFromUrl } from '../../hooks/useTargetedChainIdFromUrl'
import { useIsSwitchingToCorrectChain } from '../../state/multi-chain-links/hooks'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { switchOrAddNetwork } from '../../utils'
import { Box, Flex, Text } from 'rebass'
import { Title } from '../title'
import { Button } from '../button'

const OuterContainer = styled(Flex)`
  background: ${({ theme }) => theme.surface};
`

export const NetworkWarningModal = () => {
  const { chainId, account } = useActiveWeb3React()
  const urlLoadedChainId = useTargetedChainIdFromUrl()
  const switchingToCorrectChain = useIsSwitchingToCorrectChain()

  const [open, setOpen] = useState(false)
  const targetedNetworkName = useMemo(
    () => (urlLoadedChainId && NETWORK_DETAIL[urlLoadedChainId] ? NETWORK_DETAIL[urlLoadedChainId].chainName : ''),
    [urlLoadedChainId]
  )
  const switchingEnabled = useMemo(
    () => urlLoadedChainId && window.ethereum && window.ethereum.isMetaMask && NETWORK_DETAIL[urlLoadedChainId],
    [urlLoadedChainId]
  )

  useEffect(() => {
    setOpen(!!account && !!chainId && !!urlLoadedChainId && !!switchingToCorrectChain)
  }, [account, chainId, switchingToCorrectChain, urlLoadedChainId])

  const handleDismiss = useCallback(() => null, [])

  const handleAddClick = useCallback(() => {
    if (!urlLoadedChainId) return
    switchOrAddNetwork(NETWORK_DETAIL[urlLoadedChainId], account || undefined)
  }, [urlLoadedChainId, account])

  return (
    <Modal open={open} onDismiss={handleDismiss} maxHeight={90}>
      <OuterContainer flexDirection="column" p="20px">
        <Title mb="20px" fontSize="16px">
          Wrong network
        </Title>
        <Box>
          <Text mb="20px">
            You&apos;re currently on the wrong network to correctly visualize this page.{' '}
            {switchingEnabled
              ? `Please click the button below to automatically switch to ${targetedNetworkName}.`
              : `Please manually switch to ${targetedNetworkName} in your connected wallet to continue.`}
          </Text>
          {switchingEnabled && (
            <Button medium primary onClick={handleAddClick}>
              Switch to {targetedNetworkName}
            </Button>
          )}
        </Box>
      </OuterContainer>
    </Modal>
  )
}
