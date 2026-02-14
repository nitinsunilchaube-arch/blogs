import { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Image, Loader } from 'lucide-react';
import { uploadImage, isImageConfigured } from '../services/imageUpload';
import toast from 'react-hot-toast';

export default function ImageUploadModal({ isOpen, onClose, onInsert }) {
  const [tab, setTab] = useState('upload');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const configured = isImageConfigured();

  if (!isOpen) return null;

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10 MB');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      onInsert(imageUrl);
      toast.success('Image uploaded!');
      handleClose();
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleUrlInsert = () => {
    if (!url.trim()) {
      toast.error('Enter an image URL');
      return;
    }
    onInsert(url.trim());
    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    setUploading(false);
    setDragOver(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Insert Image</h3>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${tab === 'upload' ? 'active' : ''}`}
            onClick={() => setTab('upload')}
          >
            <Upload size={16} />
            Upload
          </button>
          <button
            className={`modal-tab ${tab === 'url' ? 'active' : ''}`}
            onClick={() => setTab('url')}
          >
            <LinkIcon size={16} />
            From URL
          </button>
        </div>

        <div className="modal-body">
          {tab === 'upload' ? (
            configured ? (
              <div
                className={`upload-zone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {uploading ? (
                  <>
                    <Loader size={32} className="spin" />
                    <p>Uploading to GitHub...</p>
                  </>
                ) : (
                  <>
                    <Image size={36} />
                    <p>Drag & drop an image here, or click to browse</p>
                    <span className="upload-hint">PNG, JPG, GIF, WebP — up to 10 MB</span>
                  </>
                )}
              </div>
            ) : (
              <div className="upload-zone disabled">
                <Image size={36} />
                <p>Image hosting not configured</p>
                <span className="upload-hint">
                  Go to <strong>Settings</strong> to connect your GitHub repo for image uploads.
                </span>
              </div>
            )
          ) : (
            <div className="url-input-group">
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlInsert()}
                autoFocus
              />
              <button className="btn btn-primary" onClick={handleUrlInsert}>
                Insert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
