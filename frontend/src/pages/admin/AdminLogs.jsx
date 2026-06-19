import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Row, Col, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSearch, faHistory, faExclamationTriangle, faInfoCircle, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { motion } from 'framer-motion';
import { logsApi } from '../../api/logsApi';

/**
 * Responsável por:
 * - Consultar logs de auditoria com filtros, datas e paginação.
 * - Apresentar eventos de utilizador/empresa devolvidos pelo backend.
 *
 * Fluxo:
 * Backoffice -> logsApi -> /audit-logs -> AuditLogs/User/Company -> Tabela.
 */
const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros enviados ao backend para compor a query de auditoria.
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 20;

  // Recarrega logs quando muda página ou qualquer filtro.
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await logsApi.getAuditLogs(currentPage, limit, searchTerm, actionFilter, startDate, endDate);

        setLogs(response.data || []);
        setTotalRecords(response.total_records || 0);

        const calculatedPages = response.total_pages || Math.ceil((response.total_records || 0) / limit) || 1;
        setTotalPages(calculatedPages);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce evita pedidos repetidos enquanto o utilizador escreve.
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm, actionFilter, startDate, endDate]);

  // Qualquer alteração de filtro reinicia a paginação para a primeira página.
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // Mantém os resultados alinhados com os filtros novos.
  };

  const getSeverityStyle = (action = '') => {
    const act = action.toLowerCase();
    if (act.includes('falha') || act.includes('erro') || act.includes('unauthorized')) {
      return { borderLeft: '4px solid #dc3545' };
    }
    return { borderLeft: '4px solid #0d6efd' };
  };

  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="animate-fade-in py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faHistory} className="text-primary me-2" />
            Activity Logs (Monitorização)
          </h2>
          <p className="text-muted small">Registo de auditoria inalterável com suporte a pesquisa por Empresa e Utilizador.</p>
        </div>
        <Button variant="outline-primary" className="rounded-3 border-2 fw-bold d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faDownload} /> Exportar CSV
        </Button>
      </div>

      {/* Filtros ligados diretamente aos query params do backend. */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-3">
          <Row className="g-3 align-items-end">
            <Col md={12} lg={4}>
              <InputGroup className="bg-light rounded-3 border-0 px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Pesquisar utilizador, empresa ou ação..."
                  className="bg-transparent border-0 shadow-none py-2"
                  value={searchTerm}
                  onChange={handleFilterChange(setSearchTerm)}
                />
              </InputGroup>
            </Col>

            <Col xs={6} md={3} lg={2}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1" style={{ fontSize: '0.7rem' }}>DATA INÍCIO</Form.Label>
                <Form.Control
                  type="date"
                  className="bg-light border-0 py-2 rounded-3 shadow-none text-muted"
                  value={startDate}
                  onChange={handleFilterChange(setStartDate)}
                />
              </Form.Group>
            </Col>

            <Col xs={6} md={3} lg={2}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1" style={{ fontSize: '0.7rem' }}>DATA FIM</Form.Label>
                <Form.Control
                  type="date"
                  className="bg-light border-0 py-2 rounded-3 shadow-none text-muted"
                  value={endDate}
                  onChange={handleFilterChange(setEndDate)}
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4}>
              <Form.Group>
                <Form.Label className="small text-muted mb-1" style={{ fontSize: '0.7rem' }}>TIPO DE AÇÃO</Form.Label>
                <Form.Select
                  className="bg-light border-0 py-2 rounded-3 shadow-none text-muted"
                  value={actionFilter}
                  onChange={handleFilterChange(setActionFilter)}
                >
                  <option value="">Todos os tipos</option>
                  <option value="USER_LOGIN_SUCCESS">Logins com Sucesso</option>
                  <option value="UNAUTHORIZED_ACCESS_ATTEMPT">Tentativas Não Autorizadas</option>
                  <option value="TICKET_CREATED">Criação de Tickets</option>
                  <option value="TICKET_UPDATED">Atualização de Tickets</option>
                  <option value="DOCUMENT_UPLOADED">Upload de Documentos</option>
                  <option value="DOCUMENT_DELETED">Remoção de Documentos</option>
                  <option value="USER_CREATED">Criação de Utilizadores</option>
                  <option value="USER_UPDATED">Atualização de Utilizadores</option>
                  <option value="USER_DELETED">Remoção de Utilizadores</option>
                  <option value="ROLE_ASSIGNED">Atribuição de Cargos</option>
                  <option value="ROLE_REMOVED">Remoção de Cargos</option>
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
                <th className="py-3 text-muted">Utilizador & Empresa</th>
                <th className="py-3 text-muted">Ação Realizada</th>
                <th className="px-4 py-3 text-muted text-end">Endereço IP</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {loading ? (
                // Skeleton mantém a tabela estável durante o carregamento.
                Array.from({ length: 5 }).map((_, index) => (
                  <motion.tr
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="placeholder-glow border-bottom"
                  >
                    <td className="px-4 py-4">
                      <span className="placeholder col-5 rounded bg-secondary opacity-50 me-2"></span>
                      <span className="placeholder col-4 rounded bg-secondary opacity-25"></span>
                    </td>
                    <td className="py-4">
                      <div className="d-flex flex-column gap-1">
                        <span className="placeholder col-8 rounded bg-secondary opacity-50"></span>
                        <span className="placeholder col-4 rounded bg-secondary opacity-25"></span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="d-flex align-items-center">
                        <span className="placeholder rounded-circle bg-secondary opacity-50 me-2" style={{ width: '16px', height: '16px' }}></span>
                        <span className="placeholder col-8 rounded bg-secondary opacity-50"></span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <span className="placeholder col-5 rounded bg-secondary opacity-50"></span>
                    </td>
                  </motion.tr>
                ))
              ) : error ? (
                <tr><td colSpan="4" className="text-center py-5 text-danger">Erro: {error}</td></tr>
              ) : logs.length > 0 ? (
                logs.map((log) => {
                  const dateObj = new Date(log.createdAt);
                  const formattedDate = dateObj.toLocaleDateString('pt-PT');
                  const formattedTime = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={log.id} style={getSeverityStyle(log.action)}>
                      <td className="px-4 py-3 text-muted font-monospace">
                        {formattedDate} <span className="ms-2 opacity-50">{formattedTime}</span>
                      </td>
                      <td className="py-3">
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-bold text-dark">{log.User ? log.User.email : 'Sistema'}</span>
                            {log.User && log.User.Role && (
                              <Badge bg="light" text="dark" className="border fw-normal" style={{ fontSize: '0.65rem' }}>
                                {log.User.Role.name}
                              </Badge>
                            )}
                          </div>
                          {log.User && log.User.Company && (
                            <small className="text-muted d-flex align-items-center gap-1">
                              <FontAwesomeIcon icon={faBuilding} className="opacity-50" style={{ fontSize: '0.7rem' }} />
                              {log.User.Company.name}
                            </small>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        {log.action?.toLowerCase().includes('falha') && <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger me-2" />}
                        {log.action?.toLowerCase().includes('success') && <FontAwesomeIcon icon={faInfoCircle} className="text-primary me-2" />}
                        <span className="text-secondary">{log.action}</span>
                      </td>
                      <td className="px-4 py-3 text-end text-muted font-monospace">
                        {log.ip_address === '::1' ? '127.0.0.1 (Local)' : (log.ip_address || 'N/A')}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="4" className="text-center py-5 text-muted">Nenhum registo encontrado.</td></tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Paginação baseada no total devolvido pela API. */}
        <Card.Footer className="bg-white border-0 p-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">Total de registos: {totalRecords}</small>

          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            />

            {paginationItems}

            <Pagination.Next
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            />
          </Pagination>
        </Card.Footer>

      </Card>
    </div>
  );
};

export default AdminLogs;
