import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './src/App.jsx'
import FormToFinishReview from './FormToFinishReview.jsx'

const CurrentApp = window.location.pathname.startsWith('/form-to-finish-review') ? FormToFinishReview : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CurrentApp />
  </React.StrictMode>
)
