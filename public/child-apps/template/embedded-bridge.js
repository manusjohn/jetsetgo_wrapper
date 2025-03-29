// Add this script to handle postMessage communication in the child app
window.addEventListener('message', (event) => {
  // Check if the message is from our parent and contains auth data
  if (event.data && event.data.type === 'AUTH_DATA') {
    console.log('Received authentication data from parent app');
    
    // Store the auth data in localStorage for the child app to use
    localStorage.setItem('embeddedAuthToken', event.data.authToken);
    localStorage.setItem('embeddedTenantName', event.data.tenantName);
    
    // Reload the page to apply the embedded authentication
    window.location.reload();
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
}
