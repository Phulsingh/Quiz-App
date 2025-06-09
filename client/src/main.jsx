import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContaxtProvider from './ContaxtAPI/ContaxtProvider.jsx'

createRoot(document.getElementById('root')).render(
  <ContaxtProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </ContaxtProvider>
)
