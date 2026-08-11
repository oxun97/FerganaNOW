import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function ImageUpload({ onUpload, currentImage, folder = 'rasmlar' }) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e) {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(folder)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-upload-container">
      {currentImage && (
        <div className="upload-preview">
          <img
            src={currentImage.startsWith('http') ? currentImage : `https://xqpfrmsounqbhyiwutrg.supabase.co/storage/v1/object/public/${folder}/${currentImage}`}
            alt="Preview"
          />
        </div>
      )}
      <label className="upload-label">
        {uploading ? 'Uploading...' : (currentImage ? 'Change Photo' : 'Upload Photo')}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  )
}
