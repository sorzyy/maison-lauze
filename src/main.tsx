import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReducedMotionProvider } from './context/ReducedMotionContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReducedMotionProvider>
      <App />
    </ReducedMotionProvider>
  </StrictMode>,
)
