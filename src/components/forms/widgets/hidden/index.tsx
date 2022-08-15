import { HiddenFormField } from '../../types'

interface NumberFormWidgetProps {
  spec: HiddenFormField
}

export const HiddenFormWidget = ({ spec }: NumberFormWidgetProps) => {
  return (
    <>
      <input id={spec.id} type="hidden" value={spec.value} />
    </>
  )
}
