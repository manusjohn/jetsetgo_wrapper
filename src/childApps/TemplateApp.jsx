import { useEffect, useRef, useState } from 'react';

const TemplateApp = ({ authToken, tenantName }) => {
  const containerRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create an iframe to load the child app
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    
    // Set the source to the child app
    iframe.src = '/child-apps/template/index.html';
    
    // Clear the container and append the iframe
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(iframe);
    
    // Function to pass authentication data to the iframe once it's loaded
    iframe.onload = () => {
      setIframeLoaded(true);
      
      // Post message to the iframe with authentication data
      iframe.contentWindow.postMessage({
        type: 'AUTH_DATA',
        authToken,
        tenantName
      }, '*');
      
      console.log('Sent authentication data to child app:', { authToken: authToken.substring(0, 20) + '...', tenantName });
    };
    
    // Set up a message listener to handle any responses from the iframe
    const messageHandler = (event) => {
      if (event.data && event.data.type === 'IFRAME_READY') {
        console.log('Child app is ready to receive auth data');
        iframe.contentWindow.postMessage({
          type: 'AUTH_DATA',
          authToken,
          tenantName
        }, '*');
      }
    };
    
    window.addEventListener('message', messageHandler);
    
    return () => {
      window.removeEventListener('message', messageHandler);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [containerRef, authToken, tenantName]);
  
  return (
    <div className="child-app-container">
      <div ref={containerRef} style={{ width: '100%', minHeight: '600px' }}></div>
      {iframeLoaded && (
        <div style={{ padding: '10px', background: '#f0f0f0', marginTop: '10px', borderRadius: '4px' }}>
          <p><strong>Iframe Status:</strong> Loaded</p>
          <p><strong>Auth Token:</strong> {authToken ? authToken.substring(0, 20) + '...' : 'None'}</p>
          <p><strong>Tenant Name:</strong> {tenantName || 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default TemplateApp;
