import { Template } from '@carrot-kpi/v1-sdk'

interface GenericKpiTokenDataProps {
  address: string
  template: Template
}

export const GenericKpiTokenData = ({ address, template }: GenericKpiTokenDataProps) => {
  return (
    <>
      <h3>Generic data</h3>
      <ul>
        <li>Address: {address}</li>
        <li>Template name: {template.specification.name}</li>
        <li>Template version: {template.version.toString()}</li>
        <li>Template description: {template.specification.description}</li>
        <li>Template tags: {template.specification.tags.join(', ')}</li>
      </ul>
    </>
  )
}
