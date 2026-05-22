import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';

const DefinirPassword = () => {
  // Lê o '?token=123xyz' do endereço web
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas de segurança no frontend
    if (password !== confirmPassword) {
      setStatus({ type: 'danger', message: 'As passwords não coincidem. Tente novamente.' });
      return;
    }
    
    if (password.length < 8) {
      setStatus({ type: 'warning', message: 'A password deve ter pelo menos 8 caracteres.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao ativar a conta.');
      }

      // Sucesso!
      setStatus({ type: 'success', message: 'Conta ativada com sucesso! A redirecionar para o Login...' });
      
      // Espera 3 segundos para o utilizador ler a mensagem e envia-o para o Login
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      setStatus({ type: 'danger', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Barreira de segurança visual: Se alguém abrir a página sem token, avisamos logo.
  if (!token) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Alert variant="danger" className="shadow-sm rounded-4">
          <h4 className="alert-heading">Acesso Inválido</h4>
          <p>Link de ativação inválido ou ausente. Por favor, utilize o link exato enviado para o seu e-mail.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="shadow-sm border-0 rounded-4 p-4" style={{ width: '100%', maxWidth: '450px' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h3 className="fw-bold text-dark">Ativar Conta</h3>
            <p className="text-muted small">Defina a sua password para aceder à plataforma CiberBoxSecur.</p>
          </div>

          {status.message && (
            <Alert variant={status.type} className="small rounded-3">
              {status.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Mínimo de 8 caracteres" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status.type === 'success'}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-secondary">Confirmar Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Repita a password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={status.type === 'success'}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 fw-bold py-2 rounded-3 shadow-sm" 
              disabled={isLoading || status.type === 'success'}
            >
              {isLoading ? <Spinner size="sm" animation="border" /> : 'Ativar Conta'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DefinirPassword;