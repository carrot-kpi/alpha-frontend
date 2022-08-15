import { Route, Routes } from 'react-router-dom'
import { Home } from '../home'
import { Campaign } from '../campaign'
import { Create } from '../create'

export function App() {
  return (
    <Routes>
      <Route path="/campaigns/:address" element={<Campaign />} />
      <Route path="/create" element={<Create />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
