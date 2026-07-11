import React from 'react'
import ReactDOM from 'react-dom/client'
import ETFMAssessment from './ETFMAssessment.jsx'
import FormToFinishReview from './FormToFinishReview.jsx'

const CurrentApp = window.location.pathname.startsWith('/form-to-finish-review') ? FormToFinishReview : ETFMAssessment

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CurrentApp />
  </React.StrictMode>
)
