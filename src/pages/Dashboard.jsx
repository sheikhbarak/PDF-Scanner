import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageUploader from '../components/ImageUploader.jsx'
import InfoBanner from '../components/InfoBanner.jsx'
import { scanImages } from '../services/ocr.js'
import { saveScan } from '../utils/storage.js'
import Modal from '../components/Modal.jsx'
import DocumentEditor from '../components/DocumentEditor.jsx'
import CameraCapture from '../components/CameraCapture.jsx'

function Dashboard() {
  const [items, setItems] = useState([])
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState({ index: -1, percent: 0, status: '' })
  const [results, setResults] = useState(null)
  const [docOpen, setDocOpen] = useState(false)
  const [docTitle, setDocTitle] = useState('')
  const [cameraOpen, setCameraOpen] = useState(false)
  const navigate = useNavigate()

  // Create object URLs for preview, and revoke on cleanup
  const previews = useMemo(() => {
    return items.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }))
  }, [items])

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  const onFilesAdded = (files) => {
    setItems((prev) => [...prev, ...files])
    setResults(null)
  }

  const hasImages = items.length > 0

  const startScan = async () => {
    if (!hasImages || scanning) return
    setScanning(true)
    setProgress({ index: -1, percent: 0, status: 'Starting...' })
    try {
      const res = await scanImages(items, (idx, m) => {
        const pct = typeof m.progress === 'number' ? Math.round(m.progress * 100) : progress.percent
        setProgress({ index: idx, percent: pct, status: m.status || m.message || 'Scanning...' })
      })
      setResults(res)
      setDocTitle(`Scan ${new Date().toLocaleString()}`)
      setProgress({ index: -1, percent: 100, status: 'Completed' })
    } catch (err) {
      console.error('Scan failed', err)
      setProgress({ index: -1, percent: 0, status: 'Failed' })
    } finally {
      setScanning(false)
    }
  }

  const openDocumentModal = () => {
    if (!results || !results.length) return
    setDocOpen(true)
  }

  const aggregateHTML = useMemo(() => {
    if (!results || !results.length) return ''
    return results
      .map(r => `<p>${(r.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
      .join('')
  }, [results])

  return (
    <section className="page" aria-labelledby="dashboard-title">
      <InfoBanner />
      <h1 id="dashboard-title" className="page-title">Document Scanner Pro</h1>
      <p className="page-subtitle">Upload images to preview. Scanning will be available soon.</p>

      <ImageUploader onFilesAdded={onFilesAdded} />

      <div className="capture-section" style={{ marginTop: 8, marginBottom: 8 }}>
        <button className="scan-btn" onClick={() => setCameraOpen(true)}>Take Photo</button>
      </div>

      {hasImages && (
        <div className="preview-grid" aria-label="Image preview grid">
          {previews.map((p, idx) => (
            <div key={`${p.url}-${idx}`} className="preview-item">
              <img src={p.url} alt={p.name || 'Uploaded image'} className="preview-img" />
            </div>
          ))}
        </div>
      )}

      <div className="scan-section">
        <button className="scan-btn" disabled={!hasImages || scanning} aria-disabled={!hasImages || scanning} onClick={startScan}>
          {scanning ? 'Scanning...' : 'Scan Now'}
        </button>
        {scanning && (
          <div className="progress" aria-live="polite">
            <div className="progress-bar" style={{ width: `${progress.percent}%` }} />
            <div className="progress-text">
              {progress.index >= 0 ? `Image ${progress.index + 1}/${items.length}` : ''} {progress.status}
            </div>
          </div>
        )}
      </div>

      {results && (
        <div className="results">
          <h2 className="page-title">Scan Results</h2>
          <div className="result-list">
            {results.map((r, i) => (
              <div key={i} className="result-card">
                <strong>{r.fileName}</strong>
                <p>{r.text || 'No text detected.'}</p>
              </div>
            ))}
          </div>
          <div className="save-actions">
            <button className="scan-btn" onClick={openDocumentModal}>Create Document</button>
          </div>
        </div>
      )}

      <Modal open={docOpen} title="Create Document" onClose={() => setDocOpen(false)}>
        <DocumentEditor
          initialTitle={docTitle}
          initialHTML={aggregateHTML}
          onSave={({ title, contentHTML, contentText }) => {
            saveScan({
              id: Date.now(),
              createdAt: new Date().toISOString(),
              type: 'document',
              title,
              contentHTML,
              contentText,
              sourceItems: results || [],
            })
            setDocOpen(false)
            navigate('/history')
          }}
        />
      </Modal>

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCaptured={(file) => {
          setItems((prev) => [...prev, file])
        }}
      />
    </section>
  )
}

export default Dashboard