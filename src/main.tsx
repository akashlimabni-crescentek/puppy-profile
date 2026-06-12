import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/index.css'

/**
 * Validate environment variables BEFORE mounting React.
 * If any required var is missing, this throws immediately with a clear message.
 * The user sees a meaningful error instead of a silent crash deep in the tree.
 */
import '@utils/validateEnv'

import App from './App'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found in index.html')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
