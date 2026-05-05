import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Container, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faComments, faEdit, faUsers, 
  faHistory, faFolderOpen, faSignOutAlt, faShieldAlt 
} from "@fortawesome/free-solid-svg-icons";
import './LayoutBackoffice.css';

const LayoutBackoffice = () => {
  const navItems = [
    { path: '/admin/dashboard', icon: faChartLine, label: 'Dashboard' },
    { path: '/admin/forum', icon: faComments, label: 'Fórum de Clientes' },
    { path: '/admin/cms', icon: faEdit, label: 'Gestão de Conteúdo' },
    { path: '/admin/users', icon: faUsers, label: 'Gestão de Utilizadores' },
    { path: '/admin/logs', icon: faHistory, label: 'Activity Logs' },
    { path: '/admin/docs', icon: faFolderOpen, label: 'Repositório Global' },
  ];

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light font-sans">
      {/* Sidebar - Fundo escuro como no print */}
      <aside className="sidebar-bg text-white d-flex flex-column" style={{ width: '260px' }}>
        
        {/* Logo / Header */}
        <div className="p-4 d-flex align-items-center border-bottom border-secondary">
          <FontAwesomeIcon icon={faShieldAlt} className="text-primary me-2 fs-4" />
          <span className="fw-bold fs-5">Admin<span className="text-primary">Panel</span></span>
        </div>

        {/* Links de Navegação (Centro) */}
        <Nav className="flex-column flex-grow-1 p-3 mt-2">
          {navItems.map((item) => (
            <Nav.Link 
              as={NavLink} 
              to={item.path} 
              key={item.path}
              className="d-flex align-items-center text-secondary-emphasis py-2 px-3 mb-1 rounded side-link"
            >
              <FontAwesomeIcon icon={item.icon} className="me-3" style={{ width: '20px' }} />
              <span>{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>

        {/* Conta e Logout (Baixo) */}
        <div className="p-4 border-top border-secondary mt-auto">
          <div className="d-flex align-items-center mb-3">
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '35px', height: '35px' }}>
              A
            </div>
            <div className="overflow-hidden">
              <p className="mb-0 fw-medium small text-truncate">System Admin</p>
              <small className="text-secondary d-block text-truncate">admin@cyberrisk.pt</small>
            </div>
          </div>
          <Link to="/" className="text-decoration-none text-secondary small d-flex align-items-center logout-btn">
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            Terminar Sessão
          </Link>
        </div>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main className="flex-grow-1 d-flex flex-column bg-white shadow-sm overflow-hidden">
        <header className="p-4 border-bottom bg-white d-flex align-items-center">
          <h2 className="fs-5 fw-semibold mb-0 text-dark">Painel de Controlo</h2>
        </header>
        
        <div className="flex-grow-1 overflow-auto p-4 p-md-5">
          <Container fluid>
            {/* Onde as páginas internas vão aparecer */}
            <Outlet />
          </Container>
        </div>
      </main>
    </div>
  );
};

export default LayoutBackoffice;