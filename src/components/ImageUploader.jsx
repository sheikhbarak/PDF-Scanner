import { useRef, useState } from 'react'

function ImageUploader({ onFilesAdded }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || [])
    const imageFiles = files.filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length && typeof onFilesAdded === 'function') {
      onFilesAdded(imageFiles)
    }
  }

  const onInputChange = (e) => {
    handleFiles(e.target.files)
    // Reset value to allow re-uploading the same file
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const openPicker = () => {
    inputRef.current?.click()
  }

  return (
    <div className={`uploader ${isDragging ? 'dragging' : ''}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onInputChange}
        aria-label="Upload images"
        className="uploader-input"
      />
      <div
        className="dropzone"
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        aria-label="Tap to upload images or drag and drop"
      >
        <div className="dropzone-inner">
          <div className="dropzone-icon" aria-hidden>
            📄
          </div>
          <div className="dropzone-text">
            <strong>Tap to upload images</strong>
            <span>or drag and drop</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUploader