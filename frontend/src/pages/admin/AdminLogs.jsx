import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Row, Col, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload, faSearch, faFilter, faHistory,
  faExclamationTriangle, faInfoCircle, faUserShield
} from "@fortawesome/free-solid-svg-icons";
import { logsApi } from '../../api/logsApi';


const AdminLogs = () => {
  // Estados para os dados da API
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para pesquisa e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(20);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Ligar ao Backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);

        // Chamamos a função do teu novo ficheiro
        const data = await logsApi.getAuditLogs();
        setLogs(data.data);
      } catch (err) {
        setError(err.message);
        console.error('Erro na API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getSeverityStyle = (type) => {
    switch (type) {
      case 'danger': return { borderLeft: '4px solid #dc3545' };
      case 'warning': return { borderLeft: '4px solid #ffc107' };
      default: return { borderLeft: '4px solid #0d6efd' };
    }
  };

  // Garante que logs é sempre um array antes de filtrar para evitar erros
  const safeLogs = Array.isArray(logs) ? logs : [];

  // 1. FILTRAR OS DADOS (Pesquisa + Datas)
  const filteredLogs = safeLogs.filter(log => {
    // A) Verifica a pesquisa de texto (Agora pesquisa pelo ID ou Ação)
    const matchesSearch =
      (log.user_id && log.user_id.toString().includes(searchTerm)) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase());

    // B) Verifica o intervalo de datas 
    let matchesDate = true;
    if (startDate || endDate) {
      // O createdAt vem assim: "2026-05-25T14:30:00.000Z". O split('T')[0] tira só a data "2026-05-25"
      const logDate = log.createdAt ? log.createdAt.split('T')[0] : '';
      
      if (startDate && endDate) {
        matchesDate = logDate >= startDate && logDate <= endDate;
      } else if (startDate) {
        matchesDate = logDate >= startDate; // Só tem data inicial
      } else if (endDate) {
        matchesDate = logDate <= endDate;   // Só tem data final
      }
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
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    A carregar dados do servidor...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-danger">
                    Erro: {error}
                  </td>
                </tr>
              ) : currentLogs.length > 0 ? (
                currentLogs.map((log) => {
                  const dateObj = new Date(log.createdAt);
                  const formattedDate = dateObj.toLocaleDateString('pt-PT');
                  const formattedTime = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                  const severity = log.action.toLowerCase().includes('falha') || log.action.toLowerCase().includes('erro')
                    ? 'danger'
                    : 'info';

                  return (
                    <tr key={log.id} style={getSeverityStyle(severity)}>
                      <td className="px-4 py-3 text-muted font-monospace">
                        {formattedDate} <span className="ms-2 opacity-50">{formattedTime}</span>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2">
                          {/* Como a DB só tem o ID, mostramos o ID por agora */}
                          <span className="fw-bold text-dark">User ID: {log.user_id || 'Sistema'}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {severity === 'danger' && <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger me-2" />}
                        {severity === 'info' && <FontAwesomeIcon icon={faInfoCircle} className="text-primary me-2" />}
                        <span className="text-secondary">{log.action}</span>
                      </td>
                      <td className="px-4 py-3 text-end text-muted font-monospace">
                        {/* Mapear para o nome correto da base de dados */}
                        {log.ip_address || 'N/A'}
                      </td>
                    </tr>
                  );
                })
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