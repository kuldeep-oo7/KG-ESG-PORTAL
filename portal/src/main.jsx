import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GHGProvider } from './store/GHGContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GHGProvider>
      <App />
    </GHGProvider>
  </StrictMode>,
)
