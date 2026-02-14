import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Edit3, Trash2, EyeOff, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BlogCard({ post, onDelete }) {
  const { isAdmin } = useAuth();
  const formattedDate = format(new Date(post.createdAt), 'MMM dd, yyyy');
  const isDraft = post.status === 'draft';

  return (
    <article className={`blog-card${isDraft ? ' blog-card--draft' : ''}`}>
      {post.coverImage && (
        <Link to={`/post/${post.id}`} className="blog-card-image">
          <img src={post.coverImage} alt={post.title} loading="lazy" />
        </Link>
      )}
      <div className="blog-card-body">
        {isDraft && (
          <span className="badge badge-draft">
            <EyeOff size={11} />
            Draft
          </span>
        )}

        <Link to={`/post/${post.id}`} className="blog-card-title">
          {post.title}
        </Link>
        <p className="blog-card-excerpt">{post.excerpt}</p>

        <div className="blog-card-footer">
          <div className="blog-card-meta">
            <Calendar size={13} />
            <time>{formattedDate}</time>
            {post.tags?.length > 0 && (
              <>
                <span className="meta-dot" />
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </>
            )}
          </div>

          <div className="blog-card-actions">
            {isAdmin && (
              <>
                <Link to={`/edit/${post.id}`} className="icon-btn" title="Edit">
                  <Edit3 size={15} />
                </Link>
                <button onClick={() => onDelete(post.id, post.title)} className="icon-btn icon-btn--danger" title="Delete">
                  <Trash2 size={15} />
                </button>
              </>
            )}
            <Link to={`/post/${post.id}`} className="icon-btn" title="Read">
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
