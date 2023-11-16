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
        <nav className='navbar' >
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" />
                </Link>

                <div className="hamburger-icon" onClick={toggleSidebar}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav sidebar">
                        {user ? (
                            <>
                                <NavLink to="/Home" className="nav-link">Tours</NavLink>
                                <NavLink to="/CrearTour" className="nav-link">Crear Tour</NavLink>
                                <NavLink to="/Favourites" className="nav-link">Favoritos</NavLink>

                                <div class="dropdown">
                                    <NavLink to={`/Profile/${user.idUser}`} className="nav-link">
                                        <img
                                            className="profile-picture dropbtn"
                                            src={`${process.env.PUBLIC_URL}/uploads/pfp/${user.profilePicture}`}
                                            alt="foto de perfil" />
                                    </NavLink>
                                    <div class="dropdown-content">
                                        <NavLink to={`/Profile/${user.idUser}`} className="drop-link">
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