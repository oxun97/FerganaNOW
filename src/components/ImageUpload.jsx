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
      alert('Ошибка при загрузке: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-upload-wrapper">
      {currentImage ? (
        <div className="upload-preview-box">
          <img
            src={currentImage.startsWith('http') ? currentImage : `https://xqpfrmsounqbhyiwutrg.supabase.co/storage/v1/object/public/${folder}/${currentImage}`}
            alt="Preview"
          />
          <label className="change-photo-overlay">
            <span>{uploading ? 'Загрузка...' : 'Заменить фото'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden />
          </label>
        </div>
      ) : (
        <label className="upload-placeholder-box">
          <div className="upload-icon">📸</div>
          <span>{uploading ? 'Загрузка...' : 'Нажмите, чтобы добавить фото'}</span>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden />
        </label>
      )}
    </div>
  )
}
