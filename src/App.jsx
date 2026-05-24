import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ETFMAssessment from './ETFMAssessment'
import ETFMPortal from './ETFMPortal'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ETFMAssessment />} />
        <Route path="/portal" element={<ETFMPortal />} />
      </Routes>
    </BrowserRouter>
  )
}
