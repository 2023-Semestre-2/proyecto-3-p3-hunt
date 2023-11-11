import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import CrearTour from './pages/CrearTour';
import Tour from './pages/Tour';
import Favourites from './pages/Favourites';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Footer from './components/Footer';


function App() {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);


  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  function handleLogin(userLogin){
    setUser(userLogin);
    console.log('cambio de usuario');
    console.log(userLogin);
  }

  function logout() {
    // your logout code
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <BrowserRouter>
      <NavBar user={user} logout={logout} />
      <Routes>
          <Route path="/" element={user?<Home/>:<Login onLogin={handleLogin} />} />
          <Route path='/Home' element={<Home  user={user}/>} /> 
          <Route path='/Favourites' element={<Favourites user={user} />} />
          <Route path='/CrearTour' element={<CrearTour user={user} />} />
          <Route path='/Profile/:idUser' element={<Profile/>} />
          <Route path='/EditProfile' element={<EditProfile/>} />
          <Route path="/Tour/:idTour" element={<Tour user={user}  />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login onLogin={handleLogin} />} />    
      </Routes>
      <Footer user={user} />
    </BrowserRouter>
  );
}

export default App;
