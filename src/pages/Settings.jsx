import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Save, CheckCircle, XCircle, Github, Image, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loadImageConfig, saveImageConfig, testImageConnection } from '../services/imageUpload';
import toast from 'react-hot-toast';

export default function Settings() {
  const { isAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [repo, setRepo] = useState('');
  const [token, setToken] = useState('');
  const [branch, setBranch] = useState('main');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    const config = loadImageConfig();
    if (config) {
      setUsername(config.username || '');
      setRepo(config.repo || '');
      setToken(config.token || '');
      setBranch(config.branch || 'main');
    }
  }, []);

  if (!isAdmin) return <Navigate to="/login" replace />;

  const handleSave = () => {
    if (!username.trim() || !repo.trim() || !token.trim()) {
      toast.error('Fill in all required fields');
      return;
    }
    saveImageConfig({
      username: username.trim(),
      repo: repo.trim(),
      token: token.trim(),
      branch: branch.trim() || 'main',
    });
    toast.success('Image settings saved!');
  };

  const handleTest = async () => {
    handleSave();
    setTesting(true);
    setStatus(null);
    try {
      await testImageConnection();
      setStatus('success');
      toast.success('Connected!');
    } catch (err) {
      setStatus('error');
      toast.error(err.message || 'Connection failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-hero">
        <Image size={28} />
        <h1>Image Hosting</h1>
        <p>Connect a GitHub repo to store uploaded images.</p>
      </div>

      <div className="settings-card">
        <div className="settings-info">
          <Github size={18} />
          <span>
            Images are uploaded to a GitHub repository. You need a{' '}
            <a href="https://github.com/settings/tokens/new?scopes=repo&description=BlogImages" target="_blank" rel="noopener noreferrer">
              Personal Access Token
            </a>{' '}
            with <code>repo</code> scope.
          </span>
        </div>

        <div className="field">
          <label htmlFor="gh-user">GitHub Username</label>
          <input id="gh-user" type="text" placeholder="your-username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="gh-repo">Repository</label>
          <input id="gh-repo" type="text" placeholder="my-blog-images" value={repo} onChange={(e) => setRepo(e.target.value)} />
          <span className="field-hint">Must already exist on GitHub</span>
        </div>

        <div className="field">
          <label htmlFor="gh-token">Access Token</label>
          <input id="gh-token" type="password" placeholder="ghp_xxxxxxxxxxxx" value={token} onChange={(e) => setToken(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="gh-branch">Branch</label>
          <input id="gh-branch" type="text" placeholder="main" value={branch} onChange={(e) => setBranch(e.target.value)} />
        </div>

        {status && (
          <div className={`connection-status ${status}`}>
            {status === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {status === 'success' ? 'Connected successfully' : 'Connection failed — check your details'}
          </div>
        )}

        <div className="settings-buttons">
          <button onClick={handleTest} className="btn btn-outline" disabled={testing}>
            {testing ? <Loader size={16} className="spin" /> : <Github size={16} />}
            {testing ? 'Testing...' : 'Test'}
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
