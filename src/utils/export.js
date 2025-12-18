import { jsPDF } from 'jspdf'

function downloadBlob(filename, mime, data) {
  const blob = new Blob([data], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportAsHTML(entry) {
  const title = entry.title || 'Document'
  const htmlBody = entry.contentHTML || `<pre>${(entry.text || '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</pre>`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title><meta name="viewport" content="width=device-width, initial-scale=1"/><style>body{font-family: -apple-system,Segoe UI,Roboto,Helvetica,Arial;line-height:1.6;padding:24px} .signature-block{margin-top:16px;border-top:1px solid #ddd;padding-top:8px} .signature-label{color:#666;margin-bottom:6px} img{max-width:100%}</style></head><body><h1>${title}</h1>${htmlBody}</body></html>`
  downloadBlob(`${safeFilename(title)}.html`, 'text/html', html)
}

export function exportAsTXT(entry) {
  const title = entry.title || 'Document'
  const text = entry.contentText || entry.text || ''
  downloadBlob(`${safeFilename(title)}.txt`, 'text/plain', text)
}

export function exportAsMD(entry) {
  const title = entry.title || 'Document'
  const text = entry.contentText || entry.text || ''
  const md = `# ${title}\n\n${text}`
  downloadBlob(`${safeFilename(title)}.md`, 'text/markdown', md)
}

export async function exportAsPDF(entry) {
  const title = entry.title || 'Document'
  const container = document.createElement('div')
  container.style.width = '800px'
  container.innerHTML = `<h1>${title}</h1>${entry.contentHTML || `<pre>${(entry.text || '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</pre>`}`
  document.body.appendChild(container)
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  await doc.html(container, {
    x: 24,
    y: 24,
    html2canvas: { scale: 0.9 },
  })
  document.body.removeChild(container)
  doc.save(`${safeFilename(title)}.pdf`)
}

function safeFilename(name) {
  return String(name).replace(/[^a-z0-9\-\_\s]/gi, '').trim().replace(/\s+/g, '-') || 'document'
}