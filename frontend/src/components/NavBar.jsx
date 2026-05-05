import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logos/CiberBoxSecur-Minimal-NegativeVersion.svg';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-4"> 
        
        {/* Logo à Esquerda */}
        <a className="navbar-brand fw-bold" to="/">
          <img src={Logo} alt="Logo" height="60"/>
        </a>

        {/* Botão Hamburger (Mobile) */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navConteudoPrincipal"
          aria-controls="navConteudoPrincipal" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navConteudoPrincipal">
          
          {/* Links */}
          <ul className="navbar-nav mx-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link" aria-current="page" to="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Serviços</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Notícias</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contactos</a>
            </li>
          </ul>

          {/* Botão à DIREITA */}
          <div className="d-flex justify-content-center">
            <Link to="/login" className="btn btn-light fw-semibold d-inline-flex align-items-center gap-2">
              Portal do cliente
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;