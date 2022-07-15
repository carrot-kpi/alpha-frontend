import { OracleTemplateSpecification, TemplateVersion } from '@carrot-kpi/v1-sdk'

interface GenericKpiTokenDataProps {
  address: string
  templateSpecification: OracleTemplateSpecification
  templateVersion: TemplateVersion
}

export const GenericOracleData = ({ address, templateSpecification, templateVersion }: GenericKpiTokenDataProps) => {
  return (
    <>
      <h3>Generic oracle data</h3>
      <ul>
        <li>Address: {address}</li>
        <li>Template name: {templateSpecification.name}</li>
        <li>
          Template version: v{templateVersion.major}.{templateVersion.minor}.{templateVersion.patch}
        </li>
        <li>Template description: {templateSpecification.description}</li>
        <li>Template tags: {templateSpecification.tags.join(', ')}</li>
      </ul>
    </>
  )
}
