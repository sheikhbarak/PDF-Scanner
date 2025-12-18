import { useEffect, useState } from 'react'

const KEY = 'dsp_info_banner_dismissed'

function InfoBanner() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const dismissed = localStorage.getItem(KEY) === '1'
    if (!dismissed) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(KEY, '1')
    setVisible(false)
  }

  if (!visible) return null
  return (
    <div className="info-banner" role="status" aria-live="polite">
      <span>
        Dev tip: In development you may see <code>net::ERR_ABORTED</code> logs during hot reload. These are harmless.
      </span>
      <button className="banner-close" onClick={dismiss} aria-label="Dismiss">✕</button>
    </div>
  )
}

export default InfoBanner