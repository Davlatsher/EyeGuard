import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import OverlayView from './OverlayView'
import './index.css'
import './i18n'

// The real OS overlay window is opened with ?overlay=1 — render only the
// fullscreen strict break there, not the whole app.
const isOverlay = new URLSearchParams(window.location.search).get('overlay') === '1'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isOverlay ? <OverlayView /> : <App />}
  </React.StrictMode>,
)