import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'

const Container = styled.div`
  height: 12px;
  width: 100%;
  background-color: ${(props) => props.theme.divider};
  border-radius: 6px;
`

const Child = styled.div<{ progress: number }>`
  height: 12px;
  border-radius: 6px;
  background-color: ${(props) => props.theme.primary};
  width: ${(props) => props.progress * 100}%;
`

interface ProgressBarProps {
  progress: number
  lowerBound: number
  higherBound: number
}

export function ProgressBar({ progress, lowerBound, higherBound }: ProgressBarProps) {
  return (
    <Flex flexDirection="column">
      <Box mb="8px">
        <Container>
          <Child progress={progress} />
        </Container>
      </Box>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="14px" lineHeight="24px">
            {lowerBound}
          </Text>
        </Box>
        <Box>
          <Text fontSize="14px" lineHeight="24px">
            {higherBound}
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}
