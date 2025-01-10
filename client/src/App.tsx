import './App.css'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Register from './pages/Register'
import Login from './pages/Login'
import HomePage from './pages/HomePage';
import Header from './components/Header';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <>
        {showHeader && <Header />}
        <div className="container">
          <Routes>
            {/* public routes */}
            <Route path="/login" element={!isAuthenticated ? <Login />: <Navigate to='/home'/>} />
            <Route path="/register" element={!isAuthenticated ? <Register />: <Navigate to='/home'/>} />

            {/* private routes */}
            <Route path="/home" element={isAuthenticated? <HomePage />: <Navigate to='/login'/>} />
            
          </Routes>
        </div>
    </>
  )
}

export default App
