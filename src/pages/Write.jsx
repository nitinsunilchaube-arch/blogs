import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Save, ArrowLeft, X, Plus, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import Editor from '../components/Editor';
import toast from 'react-hot-toast';

export default function Write() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createPost, updatePost, loadPost } = useBlog();
  const { isAdmin } = useAuth();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [showCoverInput, setShowCoverInput] = useState(false);
  const [initialContent, setInitialContent] = useState('');
  const [status, setStatus] = useState('published');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const post = loadPost(id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setInitialContent(post.content);
        setTags(post.tags || []);
        setCoverImage(post.coverImage || '');
        setStatus(post.status || 'published');
        if (post.coverImage) setShowCoverInput(true);
      } else {
        toast.error('Post not found');
        navigate('/');
      }
    }
  }, [id, loadPost, navigate]);

  if (!isAdmin) return <Navigate to="/login" replace />;

  const handleAddTag = (e) => {
    e?.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setTagInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }
    if (e.key === 'Backspace' && !tagInput && tags.length) setTags(tags.slice(0, -1));
  };

  const handleSave = () => {
    if (!title.trim()) return toast.error('Add a title');
    if (!content.trim() || content === '<p></p>') return toast.error('Write something first');

    setSaving(true);
    try {
      const data = { title: title.trim(), content, tags, coverImage, status };
      if (isEditing) {
        updatePost(id, data);
        toast.success('Updated!');
        navigate(`/post/${id}`);
      } else {
        const post = createPost(data);
        toast.success(status === 'draft' ? 'Draft saved!' : 'Published!');
        navigate(`/post/${post.id}`);
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="write-page">
      <div className="write-topbar">
        <button onClick={() => navigate(-1)} className="btn btn-ghost">
          <ArrowLeft size={17} />
          Back
        </button>
        <div className="write-topbar-actions">
          <button
            onClick={() => setStatus(s => s === 'draft' ? 'published' : 'draft')}
            className={`btn btn-outline btn-sm ${status === 'draft' ? 'btn--draft' : ''}`}
          >
            {status === 'draft' ? <EyeOff size={15} /> : <Eye size={15} />}
            {status === 'draft' ? 'Draft' : 'Public'}
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving...' : isEditing ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="write-body">
        {/* Cover image */}
        {!showCoverInput ? (
          <button className="cover-trigger" onClick={() => setShowCoverInput(true)}>
            <ImageIcon size={18} />
            Add cover image
          </button>
        ) : (
          <div className="cover-input">
            <input
              type="text"
              placeholder="Paste image URL..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
            <button className="icon-btn" onClick={() => { setCoverImage(''); setShowCoverInput(false); }}>
              <X size={16} />
            </button>
          </div>
        )}
        {coverImage && (
          <div className="cover-preview">
            <img src={coverImage} alt="Cover" />
          </div>
        )}

        {/* Title */}
        <textarea
          className="title-input"
          placeholder="Title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
          rows={1}
          autoFocus={!isEditing}
        />

        {/* Tags */}
        <div className="tags-row">
          {tags.map((t) => (
            <span key={t} className="tag-chip">
              {t}
              <button onClick={() => setTags(tags.filter(x => x !== t))}><X size={11} /></button>
            </span>
          ))}
          <input
            className="tag-input"
            type="text"
            placeholder={tags.length ? 'Add tag...' : 'Add tags (Enter)'}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {tagInput && (
            <button className="icon-btn icon-btn--xs" onClick={handleAddTag}><Plus size={14} /></button>
          )}
        </div>

        {/* Editor */}
        <Editor
          content={isEditing ? initialContent : ''}
          onChange={setContent}
          placeholder="Tell your story..."
        />
      </div>
    </div>
  );
}
