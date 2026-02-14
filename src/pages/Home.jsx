import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, Search, Inbox, Download, Upload } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { exportData, importData } from '../services/storage';
import toast from 'react-hot-toast';

export default function Home() {
  const { posts, loadPosts, deletePost } = useBlog();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '' });

  useEffect(() => {
    loadPosts(!isAdmin);
  }, [isAdmin, loadPosts]);

  const filteredPosts = posts.filter((post) => {
    const q = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt?.toLowerCase().includes(q) ||
      post.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleDeleteConfirm = () => {
    try {
      deletePost(deleteDialog.id);
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteDialog({ open: false, id: null, title: '' });
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup downloaded');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          importData(ev.target.result);
          loadPosts(!isAdmin);
          toast.success('Data imported');
        } catch {
          toast.error('Invalid file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1>Blog</h1>
        {isAdmin && (
          <div className="home-actions">
            <button onClick={handleExport} className="icon-btn" title="Export"><Download size={17} /></button>
            <button onClick={handleImport} className="icon-btn" title="Import"><Upload size={17} /></button>
            <Link to="/write" className="btn btn-primary">
              <PenSquare size={16} />
              New Post
            </Link>
          </div>
        )}
      </section>

      {posts.length > 3 && (
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {filteredPosts.length > 0 ? (
        <div className="blog-grid">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onDelete={(id, title) => setDeleteDialog({ open: true, id, title })}
            />
          ))}
        </div>
      ) : posts.length > 0 && search ? (
        <div className="empty-state">
          <Search size={48} strokeWidth={1} />
          <h2>No results</h2>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="empty-state">
          <Inbox size={48} strokeWidth={1} />
          <h2>No posts yet</h2>
          <p>{isAdmin ? 'Write your first post to get started.' : 'Come back soon for new stories.'}</p>
          {isAdmin && (
            <Link to="/write" className="btn btn-primary">
              <PenSquare size={16} />
              Write your first post
            </Link>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete post?"
        message={`"${deleteDialog.title}" will be permanently deleted.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, id: null, title: '' })}
      />
    </div>
  );
}
