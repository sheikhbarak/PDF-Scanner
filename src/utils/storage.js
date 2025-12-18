const KEY = 'dsp_scans'

export function saveScan(scan) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]')
    existing.unshift(scan)
    localStorage.setItem(KEY, JSON.stringify(existing))
  } catch (err) {
    console.error('Failed to save scan', err)
  }
}

export function getScans() {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(existing) ? existing : []
  } catch (err) {
    console.error('Failed to get scans', err)
    return []
  }
}

export function saveEntry(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]')
    existing.unshift(entry)
    localStorage.setItem(KEY, JSON.stringify(existing))
  } catch (err) {
    console.error('Failed to save entry', err)
  }
}