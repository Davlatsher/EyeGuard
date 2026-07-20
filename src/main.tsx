import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import OverlayView from './OverlayView'
import './index.css'
import './i18n'
import { applyAppearance, loadTheme, loadAccent } from './lib/theme'

// The real OS overlay window is opened with ?overlay=1 — render only the
// fullscreen strict break there, not the whole app.
const isOverlay = new URLSearchParams(window.location.search).get('overlay') === '1'

// Apply the saved appearance before the first paint to avoid a flash. The
// strict-break overlay is always dark, but keeps the chosen accent color.
applyAppearance(loadTheme(), loadAccent(), isOverlay)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isOverlay ? <OverlayView /> : <App />}
  </React.StrictMode>,
)