import Tesseract from 'tesseract.js'

/**
 * Scan an array of image Files and return recognized text.
 * @param {File[]} files
 * @param {(index:number, message:any)=>void} onProgress
 * @returns {Promise<Array<{fileName:string,text:string}>>}
 */
export async function scanImages(files, onProgress) {
  const results = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const { data } = await Tesseract.recognize(file, 'eng', {
      logger: (m) => onProgress?.(i, m),
    })
    results.push({ fileName: file.name || `image-${i + 1}`, text: data.text || '' })
  }
  return results
}