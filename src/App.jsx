import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import EmbeddedApp from './EmbeddedApp';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/embedded/:appName" element={<EmbeddedApp />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
