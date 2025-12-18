import { useEffect, useRef, useState } from 'react'
import SignaturePad from './SignaturePad.jsx'

function ToolbarButton({ label, onClick }) {
  return (
    <button type="button" className="toolbar-btn" onClick={onClick}>{label}</button>
  )
}

function DocumentEditor({ initialTitle, initialHTML, onSave }) {
  const [title, setTitle] = useState(initialTitle || '')
  const [html, setHtml] = useState(initialHTML || '')
  const [mode, setMode] = useState('edit') // 'edit' | 'preview'
  const [showSignature, setShowSignature] = useState(false)
  const editorRef = useRef(null)

  useEffect(() => {
    setTitle(initialTitle || '')
    setHtml(initialHTML || '')
  }, [initialTitle, initialHTML])

  const exec = (cmd, value = null) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, value)
    setHtml(editorRef.current?.innerHTML || '')
  }

  const onInput = () => {
    setHtml(editorRef.current?.innerHTML || '')
  }

  const handleSave = () => {
    const contentHTML = html
    const contentText = editorRef.current?.innerText || ''
    onSave?.({ title: title || 'Untitled', contentHTML, contentText })
  }

  return (
    <div className="doc-editor">
      <input
        className="doc-title-input"
        placeholder="Document title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="toolbar">
        <ToolbarButton label="B" onClick={() => exec('bold')} />
        <ToolbarButton label="I" onClick={() => exec('italic')} />
        <ToolbarButton label="U" onClick={() => exec('underline')} />
        <ToolbarButton label="H1" onClick={() => exec('formatBlock', 'h1')} />
        <ToolbarButton label="H2" onClick={() => exec('formatBlock', 'h2')} />
        <ToolbarButton label="• List" onClick={() => exec('insertUnorderedList')} />
        <ToolbarButton label="1. List" onClick={() => exec('insertOrderedList')} />
        <ToolbarButton label="Left" onClick={() => exec('justifyLeft')} />
        <ToolbarButton label="Center" onClick={() => exec('justifyCenter')} />
        <ToolbarButton label="Right" onClick={() => exec('justifyRight')} />
        <ToolbarButton label="Clear" onClick={() => exec('removeFormat')} />
        <div className="toolbar-spacer" />
        <ToolbarButton label="Add Signature" onClick={() => setShowSignature((s) => !s)} />
        <button type="button" className="toolbar-toggle" onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}>
          {mode === 'edit' ? 'Preview' : 'Edit'}
        </button>
      </div>

      {mode === 'edit' ? (
        <div
          className="editor-area"
          contentEditable
          ref={editorRef}
          onInput={onInput}
          suppressContentEditableWarning={true}
          dangerouslySetInnerHTML={{ __html: html }}
          aria-label="Editable document content"
        />
      ) : (
        <div className="preview-area" aria-label="Document preview" dangerouslySetInnerHTML={{ __html: html }} />
      )}

      {showSignature && (
        <SignaturePad
          onApply={(dataUrl) => {
            const appended = `${html}<div class="signature-block"><div class="signature-label">Signature</div><img class="signature-image" src="${dataUrl}" alt="Signature" /></div>`
            setHtml(appended)
            setShowSignature(false)
            // Also update the live editor if present
            if (editorRef.current) {
              editorRef.current.innerHTML = appended
            }
          }}
        />
      )}

      <div className="save-actions">
        <button className="scan-btn" onClick={handleSave}>Save Document</button>
      </div>
    </div>
  )
}

export default DocumentEditor