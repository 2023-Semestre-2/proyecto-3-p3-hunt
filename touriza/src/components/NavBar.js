import { set } from 'date-fns';
import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';



function NavBar({user, logout, trigger }) {
    const navigate = useNavigate();
    const [sidebarActive, setSidebarActive] = useState(false);
    useEffect(() => {
        console.log('cambio de usuario');
        console.log(user);
    }, [user]);
        

    const toggleSidebar = () => {
        const nav = document.querySelector('.navbar-nav');
        nav.classList.toggle('active');
        setSidebarActive(!sidebarActive);
    };


    return (
        <nav className='navbar' aria-label='Navegación principal' >
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo Touriza" />
                </Link>

                <button className="hamburger-icon" onClick={toggleSidebar} tabIndex="0" aria-label='Desplegar navbar' >
                    <div></div>
                    <div></div>
                    <div></div>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav sidebar">
                        {user ? (
                            <>
                                <NavLink to="/Home" className="nav-link" aria-label='Ir a inicio'  >Tours</NavLink>
                                <NavLink to="/CrearTour" className="nav-link" aria-label='Ir a crear tour' >Crear Tour</NavLink>
                                <NavLink to="/Favourites" className="nav-link" aria-label='Ir a favoritos'>Favoritos</NavLink>

                                <div class="dropdown">
                                    <NavLink to={`/Profile/${user.idUser}`} className="nav-link" aria-label='Ir a mi perfil'>
                                        <img
                                            className="profile-picture dropbtn"
                                            src={`${process.env.PUBLIC_URL}/uploads/pfp/${user.profilePicture}`}
                                            alt="foto de perfil" />
                                    </NavLink>
                                    <div class="dropdown-content">
                                        <NavLink to={`/Profile/${user.idUser}`} className="drop-link" aria-label='Ir a mi perfil'>
                                            Perfil
                                        </NavLink>
                                        <button 
                                            className='drop-link' 
                                            onClick={() => { logout(); navigate("/"); }}
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/Register"
                                    className="nav-link btn"
                                    id='register-btn'
                                >Registrarse</NavLink>
                                <NavLink
                                    to="/Login"
                                    className="nav-link btn"
                                    id='login-btn'
                                >Iniciar sesión</NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {sidebarActive && <div className="backdrop" onClick={toggleSidebar}></div>}
        </nav>
    );
}

export default NavBar;