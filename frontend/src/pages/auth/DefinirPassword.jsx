import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usersApi } from '../../api/usersApi';
import { Alerts } from '../../utils/Alerts';
import LogoCiberBox from '../../assets/logos/CiberBoxSecur-Minimal-color.svg';

const DefinirPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas de segurança no frontend
    if (password !== confirmPassword) {
      return Alerts.error('As passwords não coincidem. Tente novamente.');
    }
    
    if (password.length < 8) {
      return Alerts.error('A password deve ter pelo menos 8 caracteres.');
    }

    setIsLoading(true);

    try {
      const message = await usersApi.activateAccount(token, password);
      
      // Mostra o sucesso e redireciona
      await Alerts.success(message);
      navigate('/login');

    } catch (err) {
      Alerts.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Barreira de segurança visual
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
      <Card className="shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '450px' }}>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <img src={LogoCiberBox} alt="CiberBoxSecur" width="180" className="mb-3" />
            <h4 className="fw-bold text-dark">Ativar Conta</h4>
            <p className="text-muted small">Defina a sua password para aceder à plataforma.</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Mínimo de 8 caracteres" 
                required
                className="bg-light border-0 px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-secondary">Confirmar Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Repita a password" 
                required
                className="bg-light border-0 px-3 py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 fw-bold py-2 rounded-3 shadow-sm" 
              disabled={isLoading}
            >
              {isLoading ? <><Spinner size="sm" animation="border" className="me-2" /> A ativar...</> : 'Ativar Conta'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DefinirPassword;