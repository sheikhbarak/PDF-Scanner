import { useEffect, useRef, useState } from 'react'

function SignaturePad({ onApply }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    const width = Math.min(800, parent?.clientWidth || 600)
    const height = 200
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#ffffff'
    ctxRef.current = ctx
  }, [])

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    return { x, y }
  }

  const pointerDown = (e) => {
    e.preventDefault()
    const { x, y } = getPoint(e)
    drawingRef.current = true
    const ctx = ctxRef.current
    ctx.beginPath()
    ctx.moveTo(x, y)
    setHasInk(true)
  }
  const pointerMove = (e) => {
    if (!drawingRef.current) return
    e.preventDefault()
    const { x, y } = getPoint(e)
    const ctx = ctxRef.current
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  const pointerUp = (e) => {
    e.preventDefault()
    drawingRef.current = false
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
  }

  const apply = () => {
    if (!hasInk) return
    const dataUrl = canvasRef.current.toDataURL('image/png')
    onApply?.(dataUrl)
  }

  return (
    <div className="signature-pad-section">
      <div className="signature-pad">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onMouseDown={pointerDown}
          onMouseMove={pointerMove}
          onMouseUp={pointerUp}
          onMouseLeave={pointerUp}
          onTouchStart={pointerDown}
          onTouchMove={pointerMove}
          onTouchEnd={pointerUp}
        />
      </div>
      <div className="signature-actions">
        <button type="button" className="toolbar-btn" onClick={clear}>Clear</button>
        <button type="button" className="scan-btn" onClick={apply} disabled={!hasInk} aria-disabled={!hasInk}>Apply</button>
      </div>
    </div>
  )
}

export default SignaturePad