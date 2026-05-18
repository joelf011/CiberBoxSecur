import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Container, Nav, Offcanvas } from 'react-bootstrap';
import LogoMax from '../assets/logos/CiberBoxSecur-variant2.svg';
import LogoMin from '../assets/logos/CiberBoxSecur-Minimal-color.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faComments, faEdit, faUsers,
  faHistory, faFolderOpen, faSignOutAlt, faShieldAlt,
  faIndent, faOutdent, faBars, faTimes
} from "@fortawesome/free-solid-svg-icons";

const LayoutBackoffice = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', icon: faChartLine, label: 'Dashboard' },
    { path: '/admin/forum', icon: faComments, label: 'Fórum de Clientes' },
    { path: '/admin/cms', icon: faEdit, label: 'Gestão de Conteúdo' },
    { path: '/admin/users', icon: faUsers, label: 'Gestão de Utilizadores' },
    { path: '/admin/logs', icon: faHistory, label: 'Activity Logs' },
    { path: '/admin/docs', icon: faFolderOpen, label: 'Repositório Global' },
  ];

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light font-sans flex-column flex-md-row">
      <style>{`
        .sidebar-box {
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background-color: #121212;
          z-index: 1050;
        }
        .nav-label {
          white-space: nowrap;
          transition: opacity 0.2s ease, transform 0.3s ease;
          opacity: ${isCollapsed ? 0 : 1};
          transform: translateX(${isCollapsed ? '-10px' : '0'});
        }
        .side-link {
          display: flex !important;
          align-items: center !important;
          height: 48px;
          margin: 4px 8px;
          padding: 0 !important;
          color: #b3b3b3 !important;
          text-decoration: none !important;
          border-radius: 6px !important;
          transition: background 0.2s;
        }
        .side-link.active { background-color: #0d6efd !important; color: white !important; }
        .side-link:hover:not(.active) { background-color: rgba(255,255,255,0.05); color: white !important; }

        .icon-wrapper {
          min-width: 64px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .mobile-bottom-nav {
          height: 70px;
          background: white;
          border-top: 1px solid #dee2e6;
          z-index: 2000; /* Mantém a barra sempre no topo */
        }
        
        /* Previne que o conteúdo do Offcanvas fique debaixo da barra */
        .offcanvas-footer {
          padding-bottom: 85px !important; 
        }

        @media (max-width: 767.98px) {
          .main-view { padding-bottom: 75px !important; }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        /* Efeito específico para o botão de sair no desktop */
        .side-link-danger {
        color: #dc3545 !important; /* Cor danger do Bootstrap */
        background-color: rgba(220, 53, 69, 0.1) !important; /* Fundo avermelhado muito subtil */
        transition: all 0.2s ease;
        }

        .side-link-danger:hover {
        background-color: #dc3545 !important; /* Vermelho total no hover */
        color: white !important;
      }
      `}</style>

      {/* --- SIDEBAR (DESKTOP) --- */}
      <aside
        className="sidebar-box text-white d-none d-md-flex flex-column border-end border-secondary shadow"
        style={{ width: isCollapsed ? '80px' : '260px' }}
      >
        <div className="d-flex align-items-center justify-content-between px-3 overflow-hidden" style={{ height: '70px', flexShrink: 0 }}>
          {!isCollapsed && (
            <div className="d-flex align-items-center ps-2 nav-label">
              <link to="/" className="d-flex align-items-center">
                <img
                  src={LogoMax} alt="CiberBoxSecur Logo"  style={{ maxHeight:"60px", width: 'auto' }}
                />
              </link>
            </div>
          )}
          <div className={isCollapsed ? "w-100 d-flex justify-content-center" : ""}>
            <button className="btn text-secondary p-1 border-0" onClick={() => setIsCollapsed(!isCollapsed)}>
              <FontAwesomeIcon icon={isCollapsed ? faOutdent : faIndent} size="lg" />
            </button>
          </div>
        </div>

        <Nav className="flex-column flex-grow-1 mt-3 custom-scrollbar overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <Nav.Link as={NavLink} to={item.path} key={item.path} className="side-link">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <span className="nav-label small fw-medium">{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>

        <div className="mt-auto border-top border-secondary border-opacity-25 bg-black bg-opacity-25 py-3 overflow-hidden" style={{ flexShrink: 0 }}>
          <div className="d-flex align-items-center mb-3">
            <div className="icon-wrapper">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold shadow-sm text-white"
                style={{ width: '38px', height: '38px', fontSize: '13px' }}>A</div>
            </div>
            <div className="nav-label overflow-hidden">
              <p className="mb-0 fw-bold small text-white text-truncate">System Admin</p>
              <small className="text-white-50 d-block text-truncate" style={{ fontSize: '11px' }}>admin@cyberrisk.pt</small>
            </div>
          </div>
          <Link to="/" className="side-link text-decoration-none py-2 bg-white bg-opacity-10 border-0 side-link-danger">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
            <span className="nav-label small fw-bold">Terminar Sessão</span>
          </Link>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-grow-1 d-flex flex-column bg-body-tertiary main-view overflow-hidden">
        <header className="py-3 px-4 bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between" style={{ height: '70px', flexShrink: 0 }}>
          <h1 className="fs-5 fw-bold mb-0 text-secondary">Painel de Controlo</h1>
          <div className="d-md-none text-primary">
            <FontAwesomeIcon icon={faShieldAlt} size="lg" />
          </div>
        </header>

        <div className="flex-grow-1 overflow-auto p-3 p-md-4">
          <Container fluid className="py-2">
            <Outlet />
          </Container>
        </div>
      </main>

      {/* --- BOTTOM NAV (MOBILE) --- */}
      <nav className="mobile-bottom-nav d-flex d-md-none fixed-bottom shadow-lg">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex-fill d-flex flex-column align-items-center justify-content-center text-decoration-none ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`}
          >
            <FontAwesomeIcon icon={item.icon} className="mb-1 fs-5" />
            <span style={{ fontSize: '0.65rem' }}>{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
        <button
          className={`flex-fill d-flex flex-column align-items-center justify-content-center border-0 bg-transparent ${showMobileMenu ? 'text-primary' : 'text-secondary'}`}
          onClick={toggleMobileMenu}
        >
          <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} className="mb-1 fs-5" />
          <span style={{ fontSize: '0.65rem' }}>{showMobileMenu ? 'Fechar' : 'Menu'}</span>
        </button>
      </nav>

      {/* --- MENU OVERLAY MOBILE --- */}
      <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="bottom" className="h-100 border-0 bg-dark text-white">
        <Offcanvas.Header className="border-bottom border-secondary border-opacity-25 p-4">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faShieldAlt} className="text-primary me-2 fs-4" />
            <span className="fw-bold fs-4 text-white">Admin<span className="text-primary">Panel</span></span>
          </div>
          <button className="btn text-white p-2 border-0 shadow-none" onClick={() => setShowMobileMenu(false)}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column">
          <Nav className="flex-column py-3 overflow-auto custom-scrollbar">
            {navItems.map((item) => (
              <Nav.Link as={NavLink} to={item.path} key={item.path} className="side-link py-4 mx-3" onClick={() => setShowMobileMenu(false)}>
                <div className="icon-wrapper fs-4">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span className="fs-5 fw-medium">{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>

          {/* DIV CORRIGIDA COM PADDING-BOTTOM PARA NÃO FICAR POR BAIXO DA BARRA */}
          <div className="offcanvas-footer mt-auto border-top border-secondary border-opacity-25 bg-black bg-opacity-25 p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm text-white"
                style={{ width: '45px', height: '45px' }}>A</div>
              <div>
                <h6 className="mb-0 fw-bold text-white">System Admin</h6>
                <small className="text-white-50">admin@cyberrisk.pt</small>
              </div>
            </div>
            <Link to="/" className="btn btn-danger w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0">
              <FontAwesomeIcon icon={faSignOutAlt} /> Terminar Sessão
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default LayoutBackoffice;