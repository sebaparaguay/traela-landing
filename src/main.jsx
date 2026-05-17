import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'

posthog.init(
  'phc_DnYkPwUVzgtgXzbyDfQzUqapHPW3CjwKDjgo5ZGNwcm7',
  {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only'
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
