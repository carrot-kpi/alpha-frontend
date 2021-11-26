import RcSwitch from 'rc-switch'

interface SwitchProps {
  disabled?: boolean
  checked?: boolean
  onChange?: (newValue: boolean) => void
}

export const Switch = ({ disabled, checked, onChange }: SwitchProps) => {
  return <RcSwitch disabled={disabled} checked={checked} onChange={onChange} />
}
