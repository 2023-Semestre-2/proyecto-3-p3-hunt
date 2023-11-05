import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';


function NavBar({user}) {
    

    
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">Touriza</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" 
                    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button> 
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            {user ? (
                                <>
                                <NavLink to="/Home" className="nav-link">Home</NavLink>
                                <NavLink to="/Profile" className="nav-link">Profile</NavLink>
                                <NavLink to="/CrearTour" className="nav-link">Crear Tour</NavLink>
                                </>
                            ) : (
                                <>
                                <NavLink to="/Login" className="nav-link">Login</NavLink>
                                <NavLink to="/Register" className="nav-link">Register</NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

export default NavBar;