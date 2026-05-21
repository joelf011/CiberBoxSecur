import React, { useState } from 'react';
import { Card, Table, Button, Row, Col, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, faSearch, faFilter, faHistory, 
  faExclamationTriangle, faInfoCircle, faUserShield 
} from "@fortawesome/free-solid-svg-icons";

const AdminLogs = () => {
  // Estados para pesquisa e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(20); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dados Mockados (25 registos)
  const logs = [
    { id: '1023', date: '2026-03-17', time: '10:45:22', user: 'joao.silva@cyberrisk.pt', role: 'Gestor', action: 'Alteração de estado do pedido #452 para "Em Análise"', ip: '192.168.1.45', type: 'info' },
    { id: '1022', date: '2026-03-17', time: '09:12:05', user: 'c.costa@techcorp.pt', role: 'Cliente', action: 'Upload de ficheiro: matriz_ativos_2026.xlsx', ip: '85.240.12.9', type: 'info' },
    { id: '1021', date: '2026-03-16', time: '18:30:00', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Tentativa de login falhada (Senha incorreta)', ip: '10.0.0.1', type: 'danger' },
    { id: '1020', date: '2026-03-16', time: '14:20:11', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Atualização de conteúdo: CMS (Hero Section)', ip: '10.0.0.1', type: 'warning' },
    { id: '1019', date: '2026-03-15', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Revogação de acesso: utilizador externo', ip: '192.168.1.50', type: 'warning' },
    { id: '1018', date: '2026-03-15', time: '10:45:22', user: 'joao.silva@cyberrisk.pt', role: 'Gestor', action: 'Download de relatório anual', ip: '192.168.1.45', type: 'info' },
    { id: '1017', date: '2026-03-14', time: '09:12:05', user: 'c.costa@techcorp.pt', role: 'Cliente', action: 'Login bem sucedido', ip: '85.240.12.9', type: 'info' },
    { id: '1016', date: '2026-03-14', time: '18:30:00', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Criação de novo utilizador (Hospitais Lda)', ip: '10.0.0.1', type: 'info' },
    { id: '1015', date: '2026-03-13', time: '14:20:11', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Atualização de permissões', ip: '10.0.0.1', type: 'warning' },
    { id: '1014', date: '2026-03-13', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Leitura de ticket #451', ip: '192.168.1.50', type: 'info' },
    { id: '1013', date: '2026-03-12', time: '10:45:22', user: 'joao.silva@cyberrisk.pt', role: 'Gestor', action: 'Fecho do pedido #450', ip: '192.168.1.45', type: 'info' },
    { id: '1012', date: '2026-03-12', time: '09:12:05', user: 'c.costa@techcorp.pt', role: 'Cliente', action: 'Novo ticket aberto', ip: '85.240.12.9', type: 'info' },
    { id: '1011', date: '2026-03-11', time: '18:30:00', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Backup manual iniciado', ip: '10.0.0.1', type: 'info' },
    { id: '1010', date: '2026-03-11', time: '14:20:11', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Backup concluído', ip: '10.0.0.1', type: 'info' },
    { id: '1009', date: '2026-03-10', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Sessão expirada', ip: '192.168.1.50', type: 'warning' },
    { id: '1008', date: '2026-03-10', time: '10:45:22', user: 'joao.silva@cyberrisk.pt', role: 'Gestor', action: 'Login bem sucedido', ip: '192.168.1.45', type: 'info' },
    { id: '1007', date: '2026-03-09', time: '09:12:05', user: 'c.costa@techcorp.pt', role: 'Cliente', action: 'Alteração de password', ip: '85.240.12.9', type: 'warning' },
    { id: '1006', date: '2026-03-09', time: '18:30:00', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Tentativa de SQL Injection bloqueada', ip: '45.33.22.11', type: 'danger' },
    { id: '1005', date: '2026-03-08', time: '14:20:11', user: 'admin@cyberrisk.pt', role: 'Admin', action: 'Bloqueio de IP automático', ip: '10.0.0.1', type: 'warning' },
    { id: '1004', date: '2026-03-08', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Acesso ao painel', ip: '192.168.1.50', type: 'info' },
    { id: '1004', date: '2026-03-08', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Acesso ao painel', ip: '192.168.1.50', type: 'info' },
    { id: '1004', date: '2026-03-08', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Acesso ao painel', ip: '192.168.1.50', type: 'info' },
    { id: '1004', date: '2026-03-08', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Acesso ao painel', ip: '192.168.1.50', type: 'info' },
    { id: '1004', date: '2026-03-08', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Acesso ao painel', ip: '192.168.1.50', type: 'info' },
    { id: '1004', date: '2026-03-08', time: '11:05:33', user: 'maria.santos@cyberrisk.pt', role: 'Gestor', action: 'Acesso ao painel', ip: '192.168.1.50', type: 'info' },
  ];

  const getSeverityStyle = (type) => {
    switch(type) {
      case 'danger': return { borderLeft: '4px solid #dc3545' };
      case 'warning': return { borderLeft: '4px solid #ffc107' };
      default: return { borderLeft: '4px solid #0d6efd' };
    }
  };

  // 1. FILTRAR OS DADOS PRIMEIRO (Pesquisa)
  // 1. FILTRAR OS DADOS (Pesquisa + Datas)
  const filteredLogs = logs.filter(log => {
    // A) Verifica a pesquisa de texto
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    // B) Verifica o intervalo de datas (como as datas estão em formato YYYY-MM-DD, o JS consegue compará-las diretamente)
    let matchesDate = true;
    if (startDate && endDate) {
      matchesDate = log.date >= startDate && log.date <= endDate;
    } else if (startDate) {
      matchesDate = log.date >= startDate; // Só tem data inicial
    } else if (endDate) {
      matchesDate = log.date <= endDate;   // Só tem data final
    }

    return matchesSearch && matchesDate;
  });

  // 2. MATEMÁTICA DA PAGINAÇÃO
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  // Apenas os logs que pertencem à página atual
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  // Quantidade total de páginas
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  // 3. GERAR OS BOTÕES DE NÚMEROS DA PAGINAÇÃO
  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage} 
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Função para lidar com a pesquisa (Garante que volta à página 1 se pesquisar algo novo)
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
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

      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-3">
          <Row className="g-3 align-items-end">
            {/* Input de Pesquisa */}
            <Col md={12} lg={4}>
              <InputGroup className="bg-light rounded-3 border-0 px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Pesquisar por utilizador ou ação..."
                  className="bg-transparent border-0 shadow-none py-2"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>
            
            {/* Input Data Início */}
            <Col xs={6} md={3} lg={2}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1" style={{ fontSize: '0.7rem' }}>DATA INÍCIO</Form.Label>
                <Form.Control 
                  type="date" 
                  className="bg-light border-0 py-2 rounded-3 shadow-none text-muted" 
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                />
              </Form.Group>
            </Col>

            {/* Input Data Fim */}
            <Col xs={6} md={3} lg={2}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1" style={{ fontSize: '0.7rem' }}>DATA FIM</Form.Label>
                <Form.Control 
                  type="date" 
                  className="bg-light border-0 py-2 rounded-3 shadow-none text-muted" 
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                />
              </Form.Group>
            </Col>

            {/* Dropdown de Tipo (Opcional, podes implementar a lógica no futuro) */}
            <Col md={6} lg={4}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1" style={{ fontSize: '0.7rem' }}>TIPO DE AÇÃO</Form.Label>
                <Form.Select className="bg-light border-0 py-2 rounded-3 shadow-none text-muted">
                  <option>Todos os tipos</option>
                  <option>Login/Acesso</option>
                  <option>Conteúdo</option>
                  <option>Utilizadores</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

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
              {/* RENDEREZIAR APENAS currentLogs EM VEZ DE logs */}
              {currentLogs.length > 0 ? (
                currentLogs.map((log) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">Nenhum registo encontrado.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        
        {/* PAGINAÇÃO DINÂMICA */}
        <Card.Footer className="bg-white border-0 p-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            A mostrar {filteredLogs.length === 0 ? 0 : indexOfFirstLog + 1} a {Math.min(indexOfLastLog, filteredLogs.length)} de {filteredLogs.length} registos
          </small>
          
          {totalPages > 1 && (
            <Pagination className="mb-0">
              <Pagination.Prev 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              />
              
              {paginationItems}
              
              <Pagination.Next 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              />
            </Pagination>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
};

export default AdminLogs;