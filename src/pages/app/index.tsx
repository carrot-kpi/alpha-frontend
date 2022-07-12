import { Route, Routes } from 'react-router-dom'
import { Home } from '../home'
import { Campaign } from '../campaign'

export function App() {
  return (
    <Routes>
      <Route path="/campaigns/:address" element={<Campaign />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
