import { Link, useLocation } from 'react-router-dom';
import { PenSquare, Home, LogOut, Shield, Settings, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <BookOpen size={22} strokeWidth={2.5} />
          <span>MyBlog</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <Home size={17} />
            <span>Home</span>
          </Link>

          {isAdmin ? (
            <>
              <Link to="/write" className={`nav-link cta ${isActive('/write') ? 'active' : ''}`}>
                <PenSquare size={17} />
                <span>Write</span>
              </Link>
              <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
                <Settings size={17} />
                <span>Settings</span>
              </Link>
              <button onClick={logout} className="nav-link">
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
              <Shield size={17} />
              <span>Admin</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
