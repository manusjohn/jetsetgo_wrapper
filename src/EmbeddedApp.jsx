import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import TemplateApp from './childApps/TemplateApp';

const EmbeddedApp = () => {
  const { appName } = useParams();
  const { authToken, tenantName, currentUser } = useAuth();
  
  if (!currentUser) {
    return (
      <div className="error-container">
        <p className="error">You must be logged in to view embedded apps</p>
        <a href="/">Back to Login</a>
      </div>
    );
  }

  if (!authToken || !tenantName) {
    return (
      <div className="error-container">
        <p className="error">Authentication token or tenant name is missing</p>
        <a href="/">Back to Login</a>
      </div>
    );
  }

  // Render the appropriate child app based on the appName parameter
  const renderChildApp = () => {
    switch(appName) {
      case 'template':
        return <TemplateApp authToken={authToken} tenantName={tenantName} />;
      default:
        return (
          <div className="error-container">
            <p className="error">Unknown app: {appName}</p>
            <a href="/">Back to Login</a>
          </div>
        );
    }
  };

  return (
    <div className="embedded-app-container">
      <div className="embedded-app-header">
        <a href="/">Back to Login</a>
        <h2>Embedded App: {appName}</h2>
      </div>
      <div className="embedded-app-content">
        {renderChildApp()}
      </div>
    </div>
  );
};

export default EmbeddedApp;
