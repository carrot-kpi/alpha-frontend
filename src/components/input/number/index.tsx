import { ReactElement, useCallback } from 'react'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import NumberFormatInput from 'react-number-format'

const Input = styled(NumberFormatInput)`
  height: 40px;
  font-family: Manrope;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 0 12px;
  outline: none;
  border: solid 1px ${(props) => props.theme.border};
  border-radius: 4px;
`

interface InputProps {
  label?: string
  placeholder: string
  value: string
  onChange?: (newText: string) => void
}

export function NumberInput({ label, placeholder, value, onChange }: InputProps): ReactElement {
  const handleChange = useCallback(
    (wrappedValue: { value: string }) => {
      const parsedValue = parseFloat(wrappedValue.value)
      if (!isNaN(parsedValue) && parsedValue < 0 && onChange) onChange('')
      else if (onChange) onChange(wrappedValue.value)
    },
    [onChange]
  )

  return (
    <Flex flexDirection="column">
      {label && <Text fontWeight="700">{label}</Text>}
      <Input
        thousandSeparator=","
        decimalSeparator="."
        placeholder={placeholder}
        value={value}
        onValueChange={handleChange}
      />
    </Flex>
  )
}
