import { ReactElement, useEffect, useState } from 'react'
import { Flex, Box, Text } from 'rebass'
import { useParams } from 'react-router-dom'
import { Card } from '../../components/card'
import Skeleton from 'react-loading-skeleton'
import styled, { useTheme } from 'styled-components'
import { ExternalLink, UndecoratedExternalLink } from '../../components/undecorated-link'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { getExplorerLink, shortenAddress } from '../../utils'
import { useV1KpiToken } from '../../hooks/useV1KpiToken'
import { KpiTokenData } from './data'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { Chip } from '../../chip'
import { Title } from '../../components/title'
import { TweetButton } from '../../components/tweet-button'
import { Twitter } from 'react-feather'
import { OracleAction } from './oracle-action'

export enum Status {
  AWAITING_EXPIRY,
  AWAITING_ANSWER,
  AWAITING_FINALIZATION,
  KPI_REACHED,
  KPI_NOT_REACHED,
}

const TitleText = styled.h1`
  font-weight: 600;
  font-size: 24px;
`

const MarkdownDiv = styled.div`
  > h1 {
    font-weight: 600;
    font-size: 24px;
  }

  > h2 {
    font-weight: 600;
    font-size: 20px;
  }

  > p {
    font-size: 16px;
  }
`

const DividerBox = styled(Box)`
  height: 1px;
  width: 100%;
  background-color: ${(props) => props.theme.border};
  transition: background-color 0.2s ease;
`

export function V1Campaign(): ReactElement {
  const { address } = useParams()
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()
  const { kpiToken, loading: loadingKpiToken } = useV1KpiToken(address)

  const [sanitizedDescription, setSanitizedDescription] = useState('')

  useEffect(() => {
    let cancelled = false
    const markdownToHtml = async () => {
      if (!kpiToken) return
      try {
        const file = await remark().use(remarkHtml, { sanitize: true }).process(kpiToken.description.description)
        const content = file?.toString()
        if (content && !cancelled) setSanitizedDescription(content)
      } catch (error) {
        console.error('error converting markdown to html', error)
      }
    }
    markdownToHtml()
    return () => {
      cancelled = false
    }
  }, [kpiToken])

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%">
      <Flex flexDirection="column" mb="60px" width={['100%', '80%', '70%', '55%']}>
        <Flex flexDirection={['column', 'row']} width="100%">
          <Flex width={['100%']} flexDirection="column">
            <Card m="8px" height="fit-content">
              <Flex justifyContent="space-between" alignItems="center" mb="16px">
                <Text fontSize="20px" lineHeight="20px" fontWeight="700" color={theme.accent} title="Creator">
                  {loadingKpiToken || !kpiToken ? <Skeleton width="80px" /> : shortenAddress(kpiToken.address)}
                </Text>
                {chainId && kpiToken?.address && (
                  <Box>
                    <ExternalLink href={getExplorerLink(chainId, kpiToken.address, 'address')} showIcon>
                      View on explorer
                    </ExternalLink>
                  </Box>
                )}
              </Flex>
              <Box mb="20px">
                {loadingKpiToken || !kpiToken ? (
                  <>
                    <Skeleton width="200px" height="24px" style={{ marginBottom: 12 }} />
                    <Skeleton width="100%" count={2} />
                  </>
                ) : (
                  <>
                    <TitleText>{kpiToken.description.title}</TitleText>
                    <MarkdownDiv dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                  </>
                )}
              </Box>
              <Box mb="12px">
                <KpiTokenData data={kpiToken?.data} />
              </Box>
              {kpiToken && kpiToken.description.tags.length > 0 ? (
                <Flex flexDirection="column">
                  <Title mb="8px">Tags:</Title>
                  <Flex mb="16px">
                    {kpiToken.description.tags.map((tag) => {
                      return (
                        <Box key={tag} mr="12px">
                          <Chip>{tag}</Chip>
                        </Box>
                      )
                    })}
                  </Flex>
                </Flex>
              ) : null}
              <Box>
                <UndecoratedExternalLink
                  title="Tweet this"
                  href={`https://twitter.com/intent/tweet?text=Check out this Carrot campaign and help me reach the goal!&url=https%3A%2F%2Fcarrot.eth.link%2F%23%2Fv1%2Fcampaigns%2F${kpiToken?.address}?chainId=${chainId}`}
                >
                  <TweetButton icon={<Twitter size="16px" />}>Tweet about this</TweetButton>
                </UndecoratedExternalLink>
              </Box>
            </Card>
            {!!kpiToken &&
              kpiToken.oracles.map((oracle, index) => {
                return (
                  <Card m="8px" key={oracle.address}>
                    <Text mb="16px" fontSize="20px" lineHeight="20px" fontWeight="700" color={theme.accent}>
                      {oracle.templateSpecification.name}
                    </Text>
                    <Title mb="8px">Description:</Title>
                    <Text mb="12px">{oracle.templateSpecification.description}</Text>
                    <DividerBox my="20px" />
                    <OracleAction oracle={oracle} />
                  </Card>
                )
              })}
          </Flex>
          {/* <Flex flexDirection="column" width={['100%', '45%', '30%']}>
            <Card flexDirection="column" m="8px">
              <Title mb="8px">Rewards</Title>
              <KpiTokenCollateral data={kpiToken?.data} />
            </Card>
          </Flex> */}
        </Flex>
      </Flex>
    </Flex>
  )
}
