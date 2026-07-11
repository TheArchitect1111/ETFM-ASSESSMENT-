import React from 'react'
import ReactDOM from 'react-dom/client'
<<<<<<< HEAD
import App from './src/App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
=======
import ETFMAssessment from './ETFMAssessment.jsx'
import FormToFinishReview from './FormToFinishReview.jsx'

const CurrentApp = window.location.pathname.startsWith('/form-to-finish-review') ? FormToFinishReview : ETFMAssessment

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CurrentApp />
>>>>>>> 26f877a (Add Dylan Debono executive review)
  </React.StrictMode>
)
