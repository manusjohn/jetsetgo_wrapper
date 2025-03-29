import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, getTenantNameFromClaims } from './firebase';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [tenantName, setTenantName] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get the Firebase token
        const token = await user.getIdToken();
        setAuthToken(token);
        
        // Get tenant name from claims
        const tenant = await getTenantNameFromClaims(user);
        setTenantName(tenant);
      } else {
        setAuthToken(null);
        setTenantName(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auth context value
  const value = {
    currentUser,
    authToken,
    tenantName,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
