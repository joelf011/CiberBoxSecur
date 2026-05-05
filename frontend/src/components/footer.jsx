import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logos/CiberBoxSecur-Minimal-NegativeVersion.svg';


const Footer = () => {
  const bgColor = '#0a192f';
  return (
    <footer className="text-secondary py-5 border-top border-secondary" style={{ backgroundColor: bgColor }}>
      <div className="container px-4">
        <div className="row gy-4">
          {/* Brand & Description */}
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center gap-2 fs-5 fw-bold text-white mb-3">
              <img 
                src={Logo} 
                alt="CiberBoxSecur Logo"
                style={{ width: '70px', height: '70px' }}
              />
              <span>CiberBoxSecur</span>
            </div>
            <p className="small lh-base">
              Protegemos o seu negócio contra ameaças digitais com soluções de cibersegurança avançadas e adequadas às exigências regulatórias atuais.
            </p>
          </div>

          {/* Services */}
          <div className="col-12 col-md-3">
            <h4 className="text-white fw-semibold mb-3 fs-6">
              Serviços
            </h4>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="#" className="link-secondary text-decoration-none">
                  Diretivas NIS2
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="link-secondary text-decoration-none">
                  Auditorias
                </a>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="col-12 col-md-3">
            <h4 className="text-white fw-semibold mb-3 fs-6">
              Platforma
            </h4>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/login" className="link-secondary text-decoration-none">
                  Área de Cliente
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="link-secondary text-decoration-none">
                  Suporte
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="col-12 col-md-3">
            <h4 className="text-white fw-semibold mb-3 fs-6">
              Contactos
            </h4>
            <ul className="list-unstyled small">
              <li className="mb-2">info@ciberboxsecur.pt</li>
              <li className="mb-2">+351 255 255 255</li>
              <li className="mb-2">Rua Luís A Duarte Santos, Nº 20 3030-403 Coimbra</li>
            </ul>
          </div>
        </div>

        <div className="row mt-5 pt-4 border-top border-secondary text-center small">
          <div className="col-12">
            &copy; {new Date().getFullYear()} CiberBoxSecur. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;