import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoCiberBox from '../assets/logos/CiberBoxSecur-Minimal-color.svg';
import { 
  faEnvelope, 
  faLock, 
  faSignInAlt,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  
  // Estados para capturar os dados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para gerir a interface (erros e carregamento)
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa erros antigos
    setLoading(true); // Ativa o estado de carregamento

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao tentar iniciar sessão.');
      }

      // SUCESSO! Guardar o token e os dados do utilizador no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redireciona para o painel
      navigate('/admin/dashboard'); 

    } catch (err) {
      console.error("Erro no login:", err);
      setErro(err.message); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm rounded-4 border-0" style={{ maxWidth: '420px', width: '100%' }}>
        
        {/* Cabeçalho Limpo */}
        <div className="text-center p-5 pb-3">
          <img src={LogoCiberBox} alt="Logo CiberBox Security" className="mb-4" style={{ height: '60px' }} />
          <h2 className="fs-4 fw-bold text-dark mb-1">Bem-vindo</h2>
          <p className="small text-muted">Acesso reservado à plataforma</p>
        </div>
        
        {/* Formulário */}
        <div className="card-body px-5 pb-5 pt-2">
          
          {erro && (
            <div className="alert alert-danger small py-2 mb-4 text-center border-0 rounded-3" role="alert">
              <FontAwesomeIcon icon={faLock} className="me-2" />
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">E-mail</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light text-muted px-3">
                  <FontAwesomeIcon icon={faEnvelope} className="fs-6" />
                </span>
                <input 
                  type="email" 
                  className="form-control text-muted shadow-none"
                  style={{ fontSize: '0.95rem', boxShadow: 'none' }}
                  placeholder="exemplo@cyberbox.pt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={loading}
                  />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-bold text-secondary mb-0">Password</label>
                <Link to="/recuperar-password" className="text-decoration-none text-primary small" style={{ fontSize: '12px' }}>
                  Recuperar password
                </Link>
              </div>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light text-muted px-3">
                  <FontAwesomeIcon icon={faLock} className="fs-6" />
                </span>
                <input 
                  type="password" 
                  className="form-control text-muted shadow-none" 
                  style={{ fontSize: '0.95rem', boxShadow: 'none' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3 mt-2 fs-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                  A validar...
                </>
              ) : (
                <>
                  Entrar
                  <FontAwesomeIcon icon={faSignInAlt} className="ms-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;