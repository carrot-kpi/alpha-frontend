import { ChangeEvent, ReactElement, useCallback } from 'react'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'

const Input = styled.input`
  width: 100%;
  height: 40px;
  font-family: Poppins;
  display: flex;
  align-items: center;
  font-size: 14px;
  outline: none;
  border: none;
  border-bottom: solid 2px ${(props) => props.theme.divider};
`

interface InputProps {
  label?: string
  placeholder: string
  value: string
  onTextChange: (newText: string) => void
}

export function TextInput({ label, placeholder, value, onTextChange }: InputProps): ReactElement {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onTextChange(event.target.value)
    },
    [onTextChange]
  )

  return (
    <Flex flexDirection="column">
      {label && <Text fontWeight="700">{label}</Text>}
      <Input placeholder={placeholder} value={value} onChange={handleChange} />
    </Flex>
  )
}
