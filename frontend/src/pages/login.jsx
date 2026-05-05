import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoCiberBox from '../assets/logos/CiberBoxSecur-Minimal-color.svg';
import { 
  faShieldAlt, 
  faEnvelope, 
  faLock, 
  faSignInAlt 
} from "@fortawesome/free-solid-svg-icons";

const PaginaLogin = () => {
  const navigate = useNavigate();
  
  // Estado para capturar os dados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentativa de login com:", { email, password });
    
    // Aqui podes adicionar a tua lógica de validação
    // Por agora, redireciona diretamente como fizeste antes
    navigate('/admin/dashboard'); 
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0b0e14' }}>
      <div className="card text-center shadow-lg" style={{ width: '400px', borderRadius: '15px', overflow: 'hidden', border: 'none' }}>
        
        {/* Cabeçalho */}
        <div className="bg-dark text-white p-4">
          <img src={LogoCiberBox} alt="Logo CiberBox Security" className="mb-1" style={{ height: '70px', width: 'auto' }} />
          <h2 className="fs-4 fw-bold">CiberBox Security</h2>
          <p className="small text-secondary">Introduza as suas credenciais para aceder</p>
        </div>
        
        {/* Formulário */}
        <div className="card-body p-4 bg-white">
          <form onSubmit={handleSubmit}>
            
            {/* Campo Email */}
            <div className="mb-3 text-start">
              <label className="form-label small fw-bold text-muted">E-mail</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FontAwesomeIcon icon={faEnvelope} className="text-secondary" />
                </span>
                <input 
                  type="email" 
                  className="form-control bg-light border-start-0" 
                  placeholder="exemplo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Campo Password */}
            <div className="mb-4 text-start">
              <label className="form-label small fw-bold text-muted">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FontAwesomeIcon icon={faLock} className="text-secondary" />
                </span>
                <input 
                  type="password" 
                  className="form-control bg-light border-start-0" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Botão de Entrar */}
            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center">
              <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
              Entrar no Sistema
            </button>

          </form>

          <div className="mt-3">
            <a href="#" className="text-decoration-none small text-primary" style={{ fontSize: '12px' }}>
              Esqueceu-se da password?
            </a>
          </div>
        </div>
        
        {/* Rodapé */}
        <div className="card-footer bg-light py-3">
          <small className="text-muted" style={{ fontSize: '10px' }}>
            Acesso Restrito a Pessoal Autorizado.
          </small>
        </div>
      </div>
    </div>
  );
};

export default PaginaLogin;