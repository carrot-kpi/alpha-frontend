import { ReactElement, useCallback, useState } from 'react'
import { Box, Flex, Text } from 'rebass'
import { CampaignCard } from '../../components/campaign-card'
import { Pagination } from '../../components/pagination'
import { Switch } from '../../components/switch'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useKpiTokens } from '../../hooks/useKpiTokens'
import { usePage } from '../../hooks/usePage'

export function Campaigns(): ReactElement {
  const { chainId } = useActiveWeb3React()
  const { loading, kpiTokens } = useKpiTokens()

  const [showUsdValues, setShowUsdValues] = useState(true)
  const [pageNumber, setPageNumber] = useState(1)
  const page = usePage(kpiTokens, 6, pageNumber, 0)

  const handleSwitchChange = useCallback((newValue: boolean) => {
    setShowUsdValues(newValue)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page)
  }, [])

  return (
    <Flex flexDirection="column" alignItems="center">
      <Flex width={['100%', '80%', '70%', '55%']} justifyContent="space-between">
        <Text fontSize="28px" fontWeight="700" mb={['16px', '0px']} mr={['0px', '24px']}>
          Campaigns
        </Text>
        <Flex alignItems="center">
          <Text mr="8px">USD values</Text>
          <Box>
            <Switch checked={showUsdValues} onChange={handleSwitchChange} />
          </Box>
        </Flex>
      </Flex>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%">
        <Flex
          justifyContent={['flex-start', 'flex-start', 'space-between']}
          alignItems="center"
          flexDirection={['column-reverse', 'column-reverse', 'row']}
          pt={['8px', '8px', '60px']}
          pb={['16px', '16px', '90px']}
          width={['100%', '80%', '70%', '55%']}
        >
          <Flex flexDirection="column">
            <Flex
              width="100%"
              px={['16px', '0px']}
              flexDirection={['column', 'row']}
              minHeight="646px"
              justifyContent="center"
              flexWrap="wrap"
            >
              {loading || !chainId
                ? new Array(6).fill(null).map((_, index) => {
                    return (
                      <Box key={index} width="100%" p="8px" maxWidth={['100%', '320px']}>
                        <CampaignCard loading />
                      </Box>
                    )
                  })
                : page.map((kpiToken) => {
                    return (
                      <Box key={kpiToken.address} width="100%" p="8px" maxWidth="320px">
                        <CampaignCard
                          creator={kpiToken.creator}
                          expiresAt={kpiToken.expiresAt}
                          goal={kpiToken.question}
                          collateral={kpiToken.collateral}
                          usdValues={showUsdValues}
                          kpiId={kpiToken.kpiId}
                        />
                      </Box>
                    )
                  })}
            </Flex>
            <Flex mt="24px" width="100%" justifyContent="center">
              <Box>
                <Pagination
                  itemsPerPage={6}
                  page={pageNumber}
                  totalItems={kpiTokens.length}
                  onPageChange={handlePageChange}
                />
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
