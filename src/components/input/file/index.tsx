import { ReactElement, useCallback } from 'react'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'

const Container = styled.div`
  width: 100%;
  font-family: Poppins;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 16px;
  font-size: 14px;
  outline: none;
  border: dashed 2px ${(props) => props.theme.divider};
  border-radius: 16px;
`

interface InputProps {
  label?: string
  value: File | null
  onChange: (file: File) => void
}

export function FileInput({ label, value, onChange }: InputProps): ReactElement {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles[0])
    },
    [onChange]
  )
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Flex flexDirection="column">
      {label && (
        <Text mb="16px" fontWeight="700">
          {label}
        </Text>
      )}
      <Container {...getRootProps()}>
        <input
          {...getInputProps({
            accept: 'image/gif,image/webp,video/mp4,video/webm',
            multiple: false,
          })}
        />
        {!!value ? value.name : 'GIF, WEBM, WEBP or MP4. Max 30mb'}.
      </Container>
    </Flex>
  )
}
