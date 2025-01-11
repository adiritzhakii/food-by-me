import './App.css'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Register from './pages/Register'
import Login from './pages/Login'
import HomePage from './pages/HomePage';
import Header from './components/Header';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import Profile from './pages/Profile';
import NewPost from './components/NewPost';
import AIPost from './components/AIPost';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const location = useLocation();
  const showHeader = location.pathname !== '/login' &&
                     location.pathname !== '/register' && location.pathname !== '/';

  return (
    <>
        {showHeader && <Header />}
        <div className="container">
          <Routes>
            {/* public routes */}
            <Route path="/login" element={!isAuthenticated ? <Login />: <Navigate to='/home'/>} />
            <Route path="/register" element={!isAuthenticated ? <Register />: <Navigate to='/home'/>} />

            {/* private routes */}
            <Route path="/" element={isAuthenticated? <Navigate to='/home'/> : <Navigate to='/login'/>} />
            <Route path="/home" element={isAuthenticated? <HomePage /> : <Navigate to='/login'/>} />
            <Route path="/profile" element={isAuthenticated? <Profile /> : <Navigate to='/login'/>} />
            <Route path="/addPost" element={isAuthenticated? <NewPost /> : <Navigate to='/login'/>} />
            <Route path="/addAIPost" element={isAuthenticated? <AIPost /> : <Navigate to='/login'/>} />
          </Routes>
        </div>
    </>
  )
}

export default App
