import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppBar from './components/AppBar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppBar></AppBar>
    <App />
  </StrictMode>,
)
