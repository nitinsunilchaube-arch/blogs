import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Write from './pages/Write';
import Read from './pages/Read';
import Login from './pages/Login';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/write" element={<Write />} />
                <Route path="/edit/:id" element={<Write />} />
                <Route path="/post/:id" element={<Read />} />
                <Route path="/login" element={<Login />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            <footer className="footer">
              <p>© {new Date().getFullYear()} MyBlog</p>
            </footer>
          </div>
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 2500,
              style: {
                background: '#1c1917',
                color: '#fafaf9',
                borderRadius: '100px',
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: 500,
              },
            }}
          />
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
