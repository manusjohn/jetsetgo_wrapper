import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [tenantName, setTenantName] = useState(null);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get the ID token with claims
          const idTokenResult = await user.getIdTokenResult();
          
          // Set the auth token
          const token = await user.getIdToken();
          setAuthToken(token);
          
          // Extract tenant info from claims
          const tenantClaim = idTokenResult.claims.tenant;
          
          if (tenantClaim && tenantClaim.name) {
            setTenantName(tenantClaim.name);
          } else {
            // If tenant name is not available in claims, use a default value
            setTenantName('default-tenant');
          }
          
          console.log('Auth token and tenant info set:', { 
            token: token.substring(0, 20) + '...', 
            tenantName: tenantClaim?.name || 'default-tenant' 
          });
        } catch (error) {
          console.error('Error getting auth token or tenant info:', error);
          // Set default tenant name if there's an error
          setTenantName('default-tenant');
        }
      } else {
        setAuthToken(null);
        setTenantName(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    authToken,
    tenantName,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
