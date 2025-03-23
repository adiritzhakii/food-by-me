import './App.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import Profile from './pages/Profile';
import NewPostModal from './components/NewPostModal';
import AIPostModal from './components/AIPostModal';
import { useState } from 'react';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const showHeader = location.pathname !== '/login' &&
                     location.pathname !== '/register' && location.pathname !== '/';

  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isAIPostModalOpen, setIsAIPostModalOpen] = useState(false);

  const handleNewPostClick = () => {
    setIsNewPostModalOpen(true);
  };

  const handleAIPostClick = () => {
    setIsAIPostModalOpen(true);
  };

  const handleModalClose = () => {
    setIsNewPostModalOpen(false);
    setIsAIPostModalOpen(false);
  };

  return (
    <>
      {showHeader && (
        <Header
          onNewPostClick={handleNewPostClick}
          onAIPostClick={handleAIPostClick}
        />
      )}
      <div className="container">
        <Routes>
          {/* public routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to='/home' />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to='/home' />} />

          {/* private routes */}
          <Route path="/" element={isAuthenticated ? <Navigate to='/home' /> : <Navigate to='/register' />} />
          <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to='/register' />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to='/register' />} />
        </Routes>
      </div>

      <NewPostModal isOpen={isNewPostModalOpen} onClose={() => setIsNewPostModalOpen(false)} />
      <AIPostModal isOpen={isAIPostModalOpen} onClose={() => setIsAIPostModalOpen(false)} />
    </>
  );
}

export default App;