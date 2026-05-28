import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ETFMAssessment from './ETFMAssessment'
import ETFMPortal from './ETFMPortal'
import ETFMStrategic from './ETFMStrategic'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ETFMAssessment />} />
        <Route path="/blueprint/continue" element={<ETFMAssessment />} />
        <Route path="/blueprint-success" element={<ETFMAssessment />} />
        <Route path="/portal" element={<ETFMPortal />} />
        <Route path="/strategic" element={<ETFMStrategic />} />
      </Routes>
    </BrowserRouter>
  )
}
