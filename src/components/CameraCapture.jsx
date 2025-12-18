import { useEffect, useRef, useState } from 'react'

function CameraCapture({ open, onClose, onCaptured }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function start() {
      setError('')
      setReady(false)
      try {
        const constraints = { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        if (cancelled) return
        streamRef.current = stream
        const video = videoRef.current
        video.srcObject = stream
        await video.play()
        setReady(true)
      } catch (err) {
        console.error('Camera error', err)
        setError('Unable to access camera. Please allow permission or use file upload.')
      }
    }
    if (open) {
      start()
    }
    return () => {
      cancelled = true
      const s = streamRef.current
      if (s) {
        s.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
    }
  }, [open])

  const capture = () => {
    try {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      const w = video.videoWidth || 1280
      const h = video.videoHeight || 720
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, w, h)
      canvas.toBlob((blob) => {
        if (!blob) return
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
        onCaptured?.(file)
        onClose?.()
      }, 'image/jpeg', 0.92)
    } catch (err) {
      console.error('Capture failed', err)
      setError('Capture failed. Try again or use file upload.')
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h2 className="page-title">Take Photo</h2>
          <button className="banner-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          {error && <p className="page-subtitle" style={{ color: 'salmon' }}>{error}</p>}
          <div className="camera-container">
            <video ref={videoRef} className="camera-video" playsInline autoPlay muted />
          </div>
          <div className="save-actions" style={{ display: 'flex', gap: 8 }}>
            <button className="scan-btn" onClick={capture} disabled={!ready} aria-disabled={!ready}>Capture</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraCapture