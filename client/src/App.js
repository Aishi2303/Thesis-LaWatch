import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import LDB from './LDB';
import Header from './Header';
import Map from './Map';
import AboutPage from './AboutPage';
import UserHeader from './UserHeader';
import Login from './Login';
import Signup from './Signup'; 
import Profile from './Profile';
import Reports from './Reports';
import ManageUsers from './ManageUsers';
import Footer from './Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      {isLoggedIn ? <UserHeader /> : <Header />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/ldb" element={<LDB />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/maps" element={<Map />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/manageusers" element={<ManageUsers />} />
        <Route path="/reports" element={<Reports />} /> 
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;