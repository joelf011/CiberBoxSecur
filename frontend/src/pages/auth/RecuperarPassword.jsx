import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoCiberBox from '../../assets/logos/CiberBoxSecur-Minimal-color.svg';
import { 
  faEnvelope, 
  faArrowLeft, 
  faPaperPlane,
  faSpinner,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

const RecuperarPassword = () => {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // TODO: Ajustar para o URL real do teu backend
      const response = await fetch('http://localhost:5000/api/auth/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao processar o pedido.');
      }

      // Se correu bem, mostramos a mensagem de sucesso
      setSucesso(true);

    } catch (err) {
      console.error("Erro na recuperação:", err);
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm rounded-4 border-0" style={{ maxWidth: '420px', width: '100%' }}>
        
        <div className="text-center p-5 pb-3">
          <img src={LogoCiberBox} alt="Logo CiberBox Security" className="mb-4" style={{ height: '60px' }} />
          <h2 className="fs-4 fw-bold text-dark mb-1">Recuperar Password</h2>
          <p className="small text-muted">Enviaremos as instruções para o seu e-mail</p>
        </div>
        
        <div className="card-body px-5 pb-5 pt-2">
          
          {erro && (
            <div className="alert alert-danger small py-2 mb-4 text-center border-0 rounded-3">
              {erro}
            </div>
          )}

          {sucesso ? (
            <div className="text-center">
              <div className="mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-success" style={{ fontSize: '3rem' }} />
              </div>
              <p className="text-muted small mb-4">
                Se o e-mail <strong>{email}</strong> estiver registado, receberá um link seguro para redefinir a sua password em breves minutos.
              </p>
              <Link to="/login" className="btn btn-outline-primary btn-lg w-100 fw-bold rounded-3 fs-6">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Voltar ao Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3 mt-2 mb-4 fs-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    A processar...
                  </>
                ) : (
                  <>
                    Enviar Link
                    <FontAwesomeIcon icon={faPaperPlane} className="ms-2" />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-decoration-none text-muted small hover-primary">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Voltar ao Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecuperarPassword;