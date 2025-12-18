import { useEffect, useState } from 'react'
import { getScans } from '../utils/storage.js'
import { exportAsPDF, exportAsHTML, exportAsMD, exportAsTXT } from '../utils/export.js'

function History() {
  const [scans, setScans] = useState([])

  useEffect(() => {
    setScans(getScans())
  }, [])

  return (
    <section className="page" aria-labelledby="history-title">
      <h1 id="history-title" className="page-title">History</h1>
      <p className="page-subtitle">Your saved scans and documents are listed below.</p>
      {scans.length === 0 ? (
        <p className="page-subtitle">No saved scans yet.</p>
      ) : (
        <div className="result-list">
          {scans.map((s) => {
            const isDoc = s.type === 'document'
            const title = isDoc ? (s.title || 'Untitled Document') : 'Scan'
            const previewText = isDoc ? (s.contentText || '') : (s.text || '')
            return (
              <div key={s.id} className="result-card">
                <div className="result-card-header">
                  <span className="result-type-badge">{isDoc ? 'Document' : 'Scan'}</span>
                  <strong style={{ marginLeft: 8 }}>{title}</strong>
                </div>
                <div className="result-meta" style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                  {new Date(s.createdAt).toLocaleString()}
                </div>
                <p>{previewText.slice(0, 240) || 'No content'}</p>
                <div className="export-actions">
                  {isDoc ? (
                    <>
                      <button className="toolbar-btn" onClick={() => exportAsPDF(s)}>Save as PDF</button>
                      <button className="toolbar-btn" onClick={() => exportAsHTML(s)}>Save as HTML</button>
                      <button className="toolbar-btn" onClick={() => exportAsMD(s)}>Save as Markdown</button>
                      <button className="toolbar-btn" onClick={() => exportAsTXT(s)}>Save as TXT</button>
                    </>
                  ) : (
                    <>
                      <button className="toolbar-btn" onClick={() => exportAsTXT({ title: title, text: previewText })}>Save as TXT</button>
                      <button className="toolbar-btn" onClick={() => exportAsMD({ title: title, text: previewText })}>Save as Markdown</button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default History