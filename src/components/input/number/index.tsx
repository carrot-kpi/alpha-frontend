import { ReactElement, useCallback } from 'react'
import { Flex, Text } from 'rebass'
import styled from 'styled-components'
import NumberFormatInput from 'react-number-format'

const Input = styled(NumberFormatInput)`
  height: 40px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.content};
  font-family: Manrope;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 0 12px;
  outline: none;
  border: solid 1px ${(props) => props.theme.border};
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease, border 0.2s ease;

  :disabled {
    cursor: not-allowed;
    background-color: ${(props) => props.theme.disabled};
    color: ${(props) => props.theme.disabledContent};
  }

  ::placeholder {
    font-family: Manrope;
    color: ${(props) => props.theme.contentSecondary};
    cursor: not-allowed;
  }
`

interface InputProps {
  label?: string
  placeholder: string
  value: string
  disabled?: boolean
  onChange?: (newText: string) => void
}

export function NumberInput({ label, placeholder, value, disabled, onChange }: InputProps): ReactElement {
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
        disabled={disabled}
        thousandSeparator=","
        decimalSeparator="."
        placeholder={placeholder}
        value={value}
        onValueChange={handleChange}
      />
    </Flex>
  )
}
