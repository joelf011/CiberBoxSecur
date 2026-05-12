import React, { useState } from 'react';
import { Card, Table, Button, Row, Col, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, faSearch, faFilter, faHistory, 
  faExclamationTriangle, faInfoCircle, faUserShield 
} from "@fortawesome/free-solid-svg-icons";

const AdminLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dados Mockados com níveis de severidade
  const logs = [
    { id: '1023', date: '2026-03-17', time: '10:45:22', user: 'joao.silva@cyberrisk.pt', role: 'Gestor', action: 'Alteração de estado do pedido #452 para "Em Análise"', ip: '192.168.1.45', type: 'info' },
    { id: '1022', date: '2026-03-17', time: '09:12:05', user: 'c.costa@techcorp.pt', role: 'Cliente', action: 'Upload de ficheiro: matriz_ativos_2026.xlsx', ip: '85.240.12.9', type: 'info' },
    { id: '1021', date: '2026-03-16', time: '18:30:00', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Tentativa de login falhada (Senha incorreta)', ip: '10.0.0.1', type: 'danger' },
    { id: '1020', date: '2026-03-16', time: '14:20:11', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Atualização de conteúdo: CMS (Hero Section)', ip: '10.0.0.1', type: 'warning' },
    { id: '1019', date: '2026-03-15', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Revogação de acesso: utilizador externo', ip: '192.168.1.50', type: 'warning' },
  ];

  // Helper para cores de severidade
  const getSeverityStyle = (type) => {
    switch(type) {
      case 'danger': return { borderLeft: '4px solid #dc3545' };
      case 'warning': return { borderLeft: '4px solid #ffc107' };
      default: return { borderLeft: '4px solid #0d6efd' };
    }
  };

  return (
    <div className="animate-fade-in py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faHistory} className="text-primary me-2" />
            Activity Logs (Monitorização)
          </h2>
          <p className="text-muted small">Registo de auditoria inalterável de todas as ações no sistema.</p>
        </div>
        <Button variant="outline-primary" className="rounded-3 border-2 fw-bold d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faDownload} /> Exportar CSV
        </Button>
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
                  placeholder="Pesquisar por utilizador ou ação..."
                  className="bg-transparent border-0 shadow-none py-2"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} lg={2}>
              <Form.Select className="bg-light border-0 py-2 rounded-3 shadow-none text-muted">
                <option>Tipo de Ação</option>
                <option>Login/Acesso</option>
                <option>Conteúdo</option>
                <option>Utilizadores</option>
              </Form.Select>
            </Col>
            <Col md={3} lg={2}>
              <Form.Control type="date" className="bg-light border-0 py-2 rounded-3 shadow-none text-muted" />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* TABELA DE LOGS */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light border-bottom text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              <tr>
                <th className="px-4 py-3 text-muted">Data / Hora</th>
                <th className="py-3 text-muted">Utilizador</th>
                <th className="py-3 text-muted">Ação Realizada</th>
                <th className="px-4 py-3 text-muted text-end">Endereço IP</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {logs.map((log) => (
                <tr key={log.id} style={getSeverityStyle(log.type)}>
                  <td className="px-4 py-3 text-muted font-monospace">
                    {log.date} <span className="ms-2 opacity-50">{log.time}</span>
                  </td>
                  <td className="py-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold text-dark">{log.user}</span>
                      <Badge bg="light" text="dark" className="border fw-normal">{log.role}</Badge>
                    </div>
                  </td>
                  <td className="py-3">
                    {log.type === 'danger' && <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger me-2" />}
                    {log.type === 'warning' && <FontAwesomeIcon icon={faInfoCircle} className="text-warning me-2" />}
                    <span className="text-secondary">{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-end text-muted font-monospace">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        {/* PAGINAÇÃO */}
        <Card.Footer className="bg-white border-0 p-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">A mostrar 5 de 1,240 registos</small>
          <Pagination className="mb-0">
            <Pagination.Prev disabled />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default AdminLogs;