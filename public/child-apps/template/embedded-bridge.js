// Add this script to handle postMessage communication in the child app
window.addEventListener('message', (event) => {
  // Check if the message is from our parent and contains auth data
  if (event.data && event.data.type === 'AUTH_DATA') {
    console.log('Received authentication data from parent app');
    
    // Store the auth data in localStorage for the child app to use
    localStorage.setItem('embeddedAuthToken', event.data.authToken);
    localStorage.setItem('embeddedTenantName', event.data.tenantName);
    
    // Fix base URL for assets in embedded mode
    if (!document.querySelector('base')) {
      const base = document.createElement('base');
      base.href = '/child-apps/template/';
      document.head.prepend(base);
      console.log('Added base URL for embedded mode asset resolution');
    }
    
    // Notify parent that we're ready
    try {
      window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    } catch (e) {
      console.error('Error posting message to parent:', e);
    }
    
    // Don't reload the page, as it causes an infinite loop
    // Instead, initialize the app with the embedded auth data
    if (window.initializeWithEmbeddedAuth) {
      window.initializeWithEmbeddedAuth(event.data.authToken, event.data.tenantName);
    } else {
      console.log('No initialization function found, storing auth data for later use');
    }
  }
});

// Check if we're in embedded mode (auth data in localStorage)
const embeddedAuthToken = localStorage.getItem('embeddedAuthToken');
const embeddedTenantName = localStorage.getItem('embeddedTenantName');

if (embeddedAuthToken && embeddedTenantName) {
  console.log('Running in embedded mode with provided auth data');
  
  // This will be picked up by the AuthContext in the child app
  window.embeddedAuthToken = embeddedAuthToken;
  window.embeddedTenantName = embeddedTenantName;
  
  // Ensure base URL is set for assets in embedded mode
  if (!document.querySelector('base')) {
    const base = document.createElement('base');
    base.href = '/child-apps/template/';
    document.head.prepend(base);
    console.log('Added base URL for embedded mode asset resolution');
  }
  
  // Notify parent that we're ready
  try {
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
  } catch (e) {
    console.error('Error posting message to parent:', e);
  }
}
