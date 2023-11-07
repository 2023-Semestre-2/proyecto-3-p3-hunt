import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import CrearTour from './pages/CrearTour';

function App() {

  const [user, setUser] = useState(null);

  function handleLogin(userLogin){
    setUser(userLogin);
    console.log('cambio de usuario');
    console.log(userLogin);
  }

  return (
    <BrowserRouter>
      <NavBar user={user} />
      <Routes>
          <Route path="/" element={user?<Home/>:<Login onLogin={handleLogin} />} />
          <Route path='/Home' element={<Home  user={user}/>} /> 
          <Route path='/CrearTour' element={<CrearTour user={user} />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login onLogin={handleLogin} />} />    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
