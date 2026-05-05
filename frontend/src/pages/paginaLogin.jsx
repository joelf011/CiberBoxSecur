import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faComments, faEdit, faUsers, 
  faHistory, faFolderOpen, faSignOutAlt, faShieldAlt 
} from "@fortawesome/free-solid-svg-icons";

const paginaLogin = () => {
  const navigate = useNavigate();

  // Função para simular o login e ir para o backoffice
  const handleLogin = (perfil) => {
    console.log("Login como:", perfil);
    navigate('/admin/dashboard'); // Redireciona para o backoffice
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0b0e14' }}>
      <div className="card text-center shadow-lg" style={{ width: '400px', borderRadius: '15px', overflow: 'hidden' }}>
        <div className="bg-dark text-white p-4">
          <FontAwesomeIcon icon={faShieldAlt} className="text-primary fs-1 mb-3" />
          <h2 className="fs-4 fw-bold">Login</h2>
          <p className="small text-secondary">Selecione o seu perfil para aceder à demonstração</p>
        </div>
        
        <div className="card-body p-4 bg-white text-start">
          {/* Opção Administrador */}
          <button onClick={() => handleLogin('admin')} className="btn btn-outline-light text-dark border w-100 d-flex align-items-center p-3 mb-3 hover-shadow">
            <div className="bg-light p-2 rounded-circle me-3"><FontAwesomeIcon icon={faKey} className="text-purple" /></div>
            <div>
              <div className="fw-bold small">Administrador</div>
              <div className="text-muted" style={{ fontSize: '11px' }}>Gestão global do sistema e CMS</div>
            </div>
          </button>

          {/* Opção Gestor */}
          <button onClick={() => handleLogin('gestor')} className="btn btn-outline-light text-dark border w-100 d-flex align-items-center p-3 mb-3">
             <div className="bg-light p-2 rounded-circle me-3"><FontAwesomeIcon icon={faBriefcase} className="text-primary" /></div>
             <div>
              <div className="fw-bold small">Gestor de Cibersegurança</div>
              <div className="text-muted" style={{ fontSize: '11px' }}>Avaliação de risco e gestão de clientes</div>
            </div>
          </button>

          {/* Opção Cliente */}
          <button onClick={() => handleLogin('cliente')} className="btn btn-outline-light text-dark border w-100 d-flex align-items-center p-3">
             <div className="bg-light p-2 rounded-circle me-3"><FontAwesomeIcon icon={faUser} className="text-success" /></div>
             <div>
              <div className="fw-bold small">Cliente (Área Privada)</div>
              <div className="text-muted" style={{ fontSize: '11px' }}>Visualização de report e submissão de dados</div>
            </div>
          </button>
        </div>
        
        <div className="card-footer bg-light py-3">
          <small className="text-muted" style={{ fontSize: '10px' }}>Nota: Plataforma protótipo. Não introduza dados reais.</small>
        </div>
      </div>
    </div>
  );
};

export default paginaLogin;