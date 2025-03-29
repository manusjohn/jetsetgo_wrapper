import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const EmbeddedApp = () => {
  const { appName } = useParams();
  const { authToken, tenantName, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [childAppComponent, setChildAppComponent] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setError('You must be logged in to view embedded apps');
      setLoading(false);
      return;
    }

    if (!authToken || !tenantName) {
      setError('Authentication token or tenant name is missing');
      setLoading(false);
      return;
    }

    // This is a placeholder for dynamically loading the child app
    // In a real implementation, this would dynamically import the child app
    // or render it from an npm package
    setLoading(false);
    setChildAppComponent(
      <div className="child-app-placeholder">
        <h3>Child App: {appName}</h3>
        <p>This is where the {appName} app would be embedded.</p>
        <p>Authentication details being passed to child app:</p>
        <ul>
          <li><strong>authToken:</strong> {authToken.substring(0, 20)}...</li>
          <li><strong>tenantName:</strong> {tenantName}</li>
        </ul>
      </div>
    );
  }, [appName, authToken, tenantName, currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <Link to="/">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="embedded-app-container">
      <div className="embedded-app-header">
        <Link to="/">Back to Login</Link>
        <h2>Embedded App: {appName}</h2>
      </div>
      <div className="embedded-app-content">
        {childAppComponent}
      </div>
    </div>
  );
};

export default EmbeddedApp;
