import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Edit3, Trash2, EyeOff } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

export default function Read() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPost, loadPost, deletePost, clearCurrentPost } = useBlog();
  const { isAdmin } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const post = loadPost(id, !isAdmin);
    if (!post) { toast.error('Post not found'); navigate('/'); }
    return () => clearCurrentPost();
  }, [id, isAdmin, loadPost, clearCurrentPost, navigate]);

  const handleDelete = () => {
    try { deletePost(id); toast.success('Deleted'); navigate('/'); }
    catch { toast.error('Delete failed'); }
    setConfirmDelete(false);
  };

  if (!currentPost) return null;

  return (
    <div className="read-page">
      <nav className="read-nav">
        <button onClick={() => navigate('/')} className="btn btn-ghost">
          <ArrowLeft size={17} />
          All posts
        </button>
        {isAdmin && (
          <div className="read-nav-actions">
            <Link to={`/edit/${currentPost.id}`} className="btn btn-outline btn-sm">
              <Edit3 size={15} />
              Edit
            </Link>
            <button onClick={() => setConfirmDelete(true)} className="btn btn-outline btn-sm btn--danger-text">
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        )}
      </nav>

      <article className="article">
        {currentPost.status === 'draft' && (
          <div className="draft-bar">
            <EyeOff size={14} />
            Draft — not visible to readers
          </div>
        )}

        {currentPost.coverImage && (
          <figure className="article-cover">
            <img src={currentPost.coverImage} alt="" />
          </figure>
        )}

        <header className="article-header">
          <h1>{currentPost.title}</h1>
          <div className="article-meta">
            <span><Calendar size={14} /> {format(new Date(currentPost.createdAt), 'MMMM d, yyyy')}</span>
            {currentPost.updatedAt !== currentPost.createdAt && (
              <span><Clock size={14} /> Updated {format(new Date(currentPost.updatedAt), 'MMM d, yyyy')}</span>
            )}
          </div>
          {currentPost.tags?.length > 0 && (
            <div className="article-tags">
              {currentPost.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </header>

        <div className="article-body prose" dangerouslySetInnerHTML={{ __html: currentPost.content }} />
      </article>

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete post?"
        message={`"${currentPost.title}" will be permanently deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
