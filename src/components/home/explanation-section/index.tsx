import { ReactNode } from 'react'
import { Box, Flex, Text } from 'rebass'

interface ExplanationSectionProps {
  image: ReactNode
  title: string
  children: ReactNode
}

export function ExplanationSection({ image, title, children }: ExplanationSectionProps) {
  return (
    <Flex flexDirection="column">
      <Box mb="20px">{image}</Box>
      <Box mb="20px">
        <Text fontWeight="800" fontSize="22px" lineHeight="30px">
          {title}
        </Text>
      </Box>
      <Box>
        <Text fontSize="14px" lineHeight="26px">
          {children}
        </Text>
      </Box>
    </Flex>
  )
}
