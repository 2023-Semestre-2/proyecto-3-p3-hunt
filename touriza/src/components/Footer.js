import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter} from '@fortawesome/free-brands-svg-icons';

function Footer({ user }) {
    if (!user) {
        return null;
    }

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-info">
                    <div className="footer-logo">
                        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" />
                    </div>
                    <div className="footer-text">
                        <p>
                            Touriza es una plataforma que permite a los usuarios crear y
                            compartir tours de viajes, así como también reservar tours
                            creados por otros usuarios.
                        </p>
                    </div>
                </div>
                <div className="footer-contact">
                    <h2>Contacto</h2>
                    <p>
                        <span>Correo electrónico:</span>
                        <br />
                        <a href="mailto: touriza@gmail.com" className="footer-link">
                            touriza@gmail.com
                        </a>
                    </p>
                </div>
                <div className="footer-socials">
                    <h2>Redes sociales</h2>
                    <div className="social-links">
                        <a href="https://www.facebook.com/" >
                            <FontAwesomeIcon icon={faFacebookF} className="social-link" />
                        </a>
                        <a href="https://www.instagram.com/" >
                            <FontAwesomeIcon icon={faInstagram} className="social-link" />
                        </a>
                        <a href="https://twitter.com/" >
                            <FontAwesomeIcon icon={faTwitter} className="social-link"/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;