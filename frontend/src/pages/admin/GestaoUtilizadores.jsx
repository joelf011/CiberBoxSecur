import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Row, Col, Form, InputGroup, Badge, Pagination, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faUserPlus, faEdit, faTrash, faUsers, faRefresh 
} from "@fortawesome/free-solid-svg-icons";

const GestaoUtilizadores = () => {
  // Estados
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // URL do backend 
  const API_URL = 'https://ciberbox-backend.onrender.com/api/users'; 

  // Função para carregar os utilizadores
  const fetchUtilizadores = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Token JWT guardado no login
      const token = localStorage.getItem('token');

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error('Não foi possível carregar os utilizadores do servidor.');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Executa a função quando a página abre
  useEffect(() => {
    fetchUtilizadores();
  }, []);

  // Estado - Ativo/Inativo
  const getStatusBadge = (status) => {
    return status === 'Ativo' || status === true ? 'success' : 'danger';
  };

  return (
    <div className="animate-fade-in py-2">
      {/* CABEÇALHO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faUsers} className="text-primary me-2" />
            Gestão de Utilizadores
          </h2>
          <p className="text-muted small">Controlo de acessos, cargos e estado das contas do sistema.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" className="rounded-3 border" onClick={fetchUtilizadores} title="Recarregar dados">
            <FontAwesomeIcon icon={faRefresh} />
          </Button>
          <Button variant="primary" className="rounded-3 border-0 fw-bold d-flex align-items-center gap-2 shadow-sm">
            <FontAwesomeIcon icon={faUserPlus} /> Adicionar Utilizador
          </Button>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-3">
          <Row className="g-3">
            <Col md={6} lg={4}>
              <InputGroup className="bg-light rounded-3 border-0 px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Pesquisar por nome ou email..."
                  className="bg-transparent border-0 shadow-none py-2"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ERRO OU CARREGAMENTO */}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" className="me-2" />
          <span className="text-muted">A ligar ao servidor...</span>
        </div>
      ) : error ? (
        <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
          <strong>Erro de Ligação</strong> {error} <br />
        </Alert>
      ) : (
        /* TABELA DE UTILIZADORES */
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light border-bottom text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                <tr>
                  <th className="px-4 py-3 text-muted">Nome</th>
                  <th className="py-3 text-muted">Email</th>
                  <th className="py-3 text-muted">Cargo</th>
                  <th className="py-3 text-muted">Estado</th>
                  <th className="px-4 py-3 text-muted text-end">Ações</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">Nenhum utilizador encontrado na base de dados.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <span className="fw-bold text-dark">{user.name}</span>
                      </td>
                      <td className="py-3 text-muted">
                        {user.email}
                      </td>
                      <td className="py-3">
                        {/* Se o teu backend envia apenas o ID, usamos uma tradução simples no frontend. 
                            Se o teu backend envia o objeto Role (user.Role.name), podes alterar aqui. */}
                        <Badge bg="light" text="dark" className="border fw-normal">
                          {user.Role ? user.Role.name : `Cargo ID: ${user.role_id}`}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {/* Usa o is_active do modelo User */}
                        <Badge bg={user.is_active ? 'success' : 'danger'} className="fw-normal bg-opacity-75">
                          {user.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Button variant="light" size="sm" className="me-2 text-primary shadow-sm border">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button variant="light" size="sm" className="text-danger shadow-sm border">
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          
          {/* PAGINAÇÃO */}
          <Card.Footer className="bg-white border-0 p-3 d-flex justify-content-between align-items-center">
            <small className="text-muted">Total: {users.length} utilizadores registados</small>
            <Pagination className="mb-0">
              <Pagination.Prev disabled />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Next disabled />
            </Pagination>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
};

export default GestaoUtilizadores;