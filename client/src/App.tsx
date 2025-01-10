import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from './pages/Register'
import Login from './pages/Login'
import HomePage from './pages/HomePage';
import Header from './components/Header';

function App() {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <>
        {showHeader && <Header />}
        <div className="container">
          <Routes>
            {/* public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* private routes */}
            <Route path="/home" element={<HomePage />} />
            
          </Routes>
        </div>
    </>
  )
}

export default App
