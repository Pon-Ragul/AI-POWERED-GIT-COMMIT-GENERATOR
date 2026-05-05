import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CommitGenerator from './components/CommitGenerator';
import { authService } from './services/auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authService.profile()
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        authService.removeStoredToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.removeStoredToken();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/signup" 
            element={!user ? <Signup onSignup={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/generator" 
            element={user ? <CommitGenerator /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
