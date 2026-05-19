import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoCiberBox from '../assets/logos/CiberBoxSecur-Minimal-color.svg';
import { 
  faEnvelope, 
  faLock, 
  faSignInAlt,
  faSpinner // Ícone novo para o loading
} from "@fortawesome/free-solid-svg-icons";

// Mudei o nome aqui de PaginaLogin para Login para bater certo com o ficheiro!
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
      // ATENÇÃO: Confirma se a porta do teu backend local é a 3000
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
      <div className="card shadow-sm" style={{ width: '420px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)' }}>
        
        {/* Cabeçalho Limpo */}
        <div className="text-center p-5 pb-3">
          <img src={LogoCiberBox} alt="Logo CiberBox Security" style={{ height: '60px', width: 'auto', marginBottom: '1.5rem' }} />
          <h2 className="fs-4 fw-bold text-dark mb-1">Bem-vindo de volta</h2>
          <p className="small text-muted">Acesso reservado à gestão CiberBoxSecur</p>
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
              <label className="form-label small fw-bold text-secondary">E-mail Corporativo</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white text-muted border-end-0 px-3">
                  <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '1rem' }} />
                </span>
                <input 
                  type="email" 
                  className="form-control border-start-0 ps-0 text-muted" 
                  style={{ fontSize: '0.95rem', boxShadow: 'none' }}
                  placeholder="exemplo@cyberrisk.pt"
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
                <a href="#" className="text-decoration-none text-primary" style={{ fontSize: '12px' }}>Recuperar?</a>
              </div>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white text-muted border-end-0 px-3">
                  <FontAwesomeIcon icon={faLock} style={{ fontSize: '1rem' }} />
                </span>
                <input 
                  type="password" 
                  className="form-control border-start-0 ps-0 text-muted" 
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
              className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3 mt-2"
              style={{ fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                  A validar...
                </>
              ) : (
                <>
                  Entrar na Plataforma
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