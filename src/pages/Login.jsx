import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { isAdmin, passwordExists, login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  if (isAdmin) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) return toast.error('Enter a password');
    const ok = login(password);
    if (ok) {
      toast.success(passwordExists ? 'Welcome back!' : 'Password set!');
      navigate('/');
    } else {
      toast.error('Wrong password');
      setPassword('');
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>{passwordExists ? 'Admin' : 'Set Password'}</h1>
        <p>{passwordExists ? 'Enter your password to manage posts.' : 'Choose a password. You only do this once.'}</p>
        <div className="login-field">
          <KeyRound size={17} />
          <input
            type="password"
            placeholder={passwordExists ? 'Password' : 'Choose password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>
        <button type="submit" className="btn btn-primary btn-full">
          <LogIn size={16} />
          {passwordExists ? 'Login' : 'Set password'}
        </button>
      </form>
    </div>
  );
}
