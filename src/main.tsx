import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Self-healing recovery mechanism for outdated/corrupted LocalStorage schemas
window.addEventListener('error', (e) => {
  console.error('Caught rendering exception: ', e.error)
  if (localStorage.getItem('portfolio_data')) {
    console.warn('Clearing corrupted local state and reloading defaults...')
    localStorage.removeItem('portfolio_data')
    window.location.reload()
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
