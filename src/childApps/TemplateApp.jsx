import { useEffect, useRef } from 'react';

const TemplateApp = ({ authToken, tenantName }) => {
  const containerRef = useRef(null);
  
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
      // Post message to the iframe with authentication data
      iframe.contentWindow.postMessage({
        type: 'AUTH_DATA',
        authToken,
        tenantName
      }, '*');
      
      console.log('Sent authentication data to child app:', { authToken: authToken.substring(0, 20) + '...', tenantName });
    };
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [containerRef, authToken, tenantName]);
  
  return (
    <div className="child-app-container">
      <div ref={containerRef} style={{ width: '100%', minHeight: '600px' }}></div>
    </div>
  );
};

export default TemplateApp;
