import { Link } from 'react-router-dom'
import { useKpiTokens } from '../../hooks/useKpiTokens'

export const Home = () => {
  const { loading, kpiTokens } = useKpiTokens()

  if (loading || !kpiTokens) return <>Loading...</>
  if (kpiTokens.length === 0) return <>No KPI tokens</>
  return (
    <ul>
      {kpiTokens.map((token) => (
        <li key={token.address}>
          {token.description.title}{' '}
          <Link to={`/campaigns/${token.address}`}>
            <button>See</button>
          </Link>
        </li>
      ))}
    </ul>
  )
}
