import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoCiberBox from '../../assets/logos/CiberBoxSecur-Minimal-color.svg';
import { faEnvelope, faArrowLeft, faPaperPlane, faSpinner, faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import { usersApi } from '../../api/usersApi';
import { Alerts } from '../../utils/Alerts';

/**
 * Responsável por:
 * - Pedir link de recuperação quando não existe token no URL.
 * - Definir nova password quando o token vem do e-mail.
 *
 * Fluxo:
 * E-mail/token -> usersApi -> AuthService -> E-mail ou atualização de password.
 */
const RecuperarPassword = () => {
  // A presença de token altera o modo da página entre pedido e redefinição.
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 
  const navigate = useNavigate();

  // Estados dos dois fluxos: pedido por e-mail e gravação da nova password.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pede link de recuperação; a resposta do backend é neutra por segurança.
  const handleRequestLink = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await usersApi.forgotPassword(email);
      setSucesso(true);
    } catch (err) {
      Alerts.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Grava a nova password depois de validar campos básicos no frontend.
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return Alerts.error('As passwords não coincidem.');
    }
    if (password.length < 8) {
      return Alerts.error('A password deve ter pelo menos 8 caracteres.');
    }

    setLoading(true);

    try {
      const message = await usersApi.resetPassword(token, password);
      await Alerts.success(message);
      navigate('/login'); // Regressa ao login após reset bem sucedido.
    } catch (err) {
      Alerts.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm rounded-4 border-0" style={{ maxWidth: '420px', width: '100%' }}>
        
        <div className="text-center p-5 pb-3">
          <img src={LogoCiberBox} alt="Logo CiberBox Security" className="mb-4" style={{ height: '60px' }} />
          <h2 className="fs-4 fw-bold text-dark mb-1">
            {token ? 'Definir Nova Password' : 'Recuperar Password'}
          </h2>
          <p className="small text-muted">
            {token ? 'Insira a sua nova palavra-passe abaixo' : 'Enviaremos as instruções para o seu e-mail'}
          </p>
        </div>
        
        <div className="card-body px-5 pb-5 pt-2">
          
          {sucesso && !token ? (
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
            
            <form onSubmit={token ? handleResetPassword : handleRequestLink}>
              
              {!token ? (
                /* Modo sem token: pede o e-mail para enviar recuperação. */
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
              ) : (
                /* Modo com token: recolhe e confirma a nova password. */
                <>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Nova Password</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light text-muted px-3">
                        <FontAwesomeIcon icon={faLock} className="fs-6" />
                      </span>
                      <input 
                        type="password" 
                        className="form-control text-muted shadow-none"
                        style={{ fontSize: '0.95rem', boxShadow: 'none' }}
                        placeholder="Mínimo de 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary">Confirmar Password</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light text-muted px-3">
                        <FontAwesomeIcon icon={faLock} className="fs-6" />
                      </span>
                      <input 
                        type="password" 
                        className="form-control text-muted shadow-none"
                        style={{ fontSize: '0.95rem', boxShadow: 'none' }}
                        placeholder="Repita a password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* A ação do botão depende do modo ativo da página. */}
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3 mt-2 mb-4 fs-6"
                disabled={loading}
              >
                {loading ? (
                  <><FontAwesomeIcon icon={faSpinner} spin className="me-2" /> A processar...</>
                ) : token ? (
                  'Guardar Password'
                ) : (
                  <><FontAwesomeIcon icon={faPaperPlane} className="me-2" /> Enviar Link</>
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-decoration-none text-muted small hover-primary">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Voltar ao Login
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
