import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logos/CiberBoxSecur-Minimal-NegativeVersion.svg";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

/**
 * Barra de navegação principal do website público.
 *
 * Responsável por:
 * - Navegação entre páginas via React Router (Home, Notícias, NIS2, Login).
 * - Scroll suave para secções específicas (Serviços, Contactos) quando o utilizador está na homepage.
 * - Redireccionamento para a homepage antes do scroll, caso esteja noutra página.
 */
const NavBar = () => {
  const bgColor = "#0a192f";

  const navigate = useNavigate();
  const location = useLocation();

  // Faz scroll suave até à secção indicada; se não estiver na homepage, redireciona primeiro.
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();

    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navega para a homepage e aguarda a renderização antes de fazer scroll.
      navigate("/");

      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container px-4">
        <Link className="navbar-brand fw-bold" to="/">
          <img src={Logo} alt="Logo" height="60" />
        </Link>

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
          <ul className="navbar-nav mx-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                onClick={(e) => handleScrollToSection(e, "services")}
                style={{ cursor: "pointer" }}
              >
                Serviços
              </a>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/noticias">
                Notícias
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/nis2">
                NIS2
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={(e) => handleScrollToSection(e, "contact")}
                style={{ cursor: "pointer" }}
              >
                Contactos
              </a>
            </li>
          </ul>

          <div className="d-flex justify-content-center">
            <Link
              to="/login"
              className="btn btn-light fw-semibold d-inline-flex align-items-center gap-2"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
