import { useState } from 'react';
import { loginWithEmailAndPassword, logout } from './firebase';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser, authToken, tenantName } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await loginWithEmailAndPassword(email, password);
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError('');
      await logout();
    } catch (error) {
      setError('Failed to log out: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>JetSetGo Wrapper App</h2>
      
      {currentUser ? (
        <div className="user-info">
          <p>Logged in as: {currentUser.email}</p>
          <p>Auth Token: <span className="token">{authToken ? `${authToken.substring(0, 20)}...` : 'None'}</span></p>
          <p>Tenant Name: {tenantName || 'None'}</p>
          <button onClick={handleLogout} disabled={loading}>
            Log Out
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
