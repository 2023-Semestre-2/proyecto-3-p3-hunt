import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';


function NavBar({user, logout}) {
    
        const navigate = useNavigate();
    
        return (
            <nav className='navbar' >
                <div className="navbar-container">
                    <Link to="/" className="navbar-brand">
                        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" />
                    </Link>
                    
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            {user ? (
                                <>
                                <NavLink to="/Home" className="nav-link">Home</NavLink>
                                <NavLink to={`/Profile/${user.idUser}`} className="nav-link">Profile</NavLink>
                                <NavLink to="/CrearTour" className="nav-link">Crear Tour</NavLink>
                                <NavLink to="/Favourites" className="nav-link">Favoritos</NavLink>
                                <button onClick={() => {logout(); navigate("/");}}>Logout</button>
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
            </nav>
        );
    }

export default NavBar;