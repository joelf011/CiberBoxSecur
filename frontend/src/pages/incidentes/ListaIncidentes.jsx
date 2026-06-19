import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEye, 
  faShieldAlt,
  faExclamationTriangle,
  faBuilding,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { incidentsApi } from '../../api/incidentsApi';
import { Alerts } from '../../utils/Alerts';

/**
 * Responsável por:
 * - Listar o histórico de incidentes visível ao utilizador autenticado.
 * - Encaminhar para criação e detalhe de incidentes.
 *
 * Fluxo:
 * Página -> incidentsApi.getAllIncidents -> Backend filtrado por empresa -> Tabela.
 */
const ListaIncidentes = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // O backend devolve apenas incidentes permitidos para o utilizador atual.
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const data = await incidentsApi.getAllIncidents();
        setIncidents(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar os incidentes.');
        Alerts.error('Não foi possível carregar o histórico.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Traduz estados internos em badges legíveis na interface portuguesa.
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Residual': return <Badge bg="light" text="dark">Residual</Badge>;
      case 'Low': return <Badge bg="info">Baixa</Badge>;
      case 'Medium': return <Badge bg="warning" text="dark">Média</Badge>;
      case 'High': return <Badge bg="danger">Alta</Badge>;
      case 'Critical': return <Badge bg="dark">CRÍTICA</Badge>;
      default: return <Badge bg="secondary">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return <Badge bg="danger" className="text-uppercase px-2 py-1">Aberto</Badge>;
      case 'Investigating': return <Badge bg="warning" text="dark" className="text-uppercase px-2 py-1">Em Investigação</Badge>;
      case 'Mitigated': return <Badge bg="info" className="text-uppercase px-2 py-1">Mitigado</Badge>;
      case 'Resolved': return <Badge bg="success" className="text-uppercase px-2 py-1">Resolvido</Badge>;
      case 'Reported_to_CNCS': return <Badge bg="primary" className="text-uppercase px-2 py-1">Reportado ao CNCS</Badge>;
      case 'Closed': return <Badge bg="secondary" className="text-uppercase px-2 py-1">Fechado</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="animate-fade-in py-2">
      {/* Entrada principal para histórico e criação de incidentes. */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faShieldAlt} className="text-primary me-2" />
            Central de Incidentes
          </h2>
          <p className="text-muted small">Acompanhamento e histórico de eventos de segurança reportados.</p>
        </div>
        <Button 
          variant="primary" 
          className="rounded-3 fw-bold shadow-sm d-flex align-items-center gap-2"
          onClick={() => navigate('/portal/incidentes/novo')}
        >
          <FontAwesomeIcon icon={faPlus} /> Reportar Incidente
        </Button>
      </div>

      {/* Tabela alimentada diretamente pela resposta do backend. */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light border-bottom text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              <tr>
                <th className="px-4 py-3 text-muted">Ticket / Data</th>
                <th className="py-3 text-muted">Empresa / Reportado por</th>
                <th className="py-3 text-muted">Resumo (Título)</th>
                <th className="py-3 text-muted">Criticidade</th>
                <th className="py-3 text-muted">Estado</th>
                <th className="px-4 py-3 text-muted text-end">Ações</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem' }}>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <Spinner size="sm" className="me-2" /> A carregar incidentes...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-danger">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> {error}
                  </td>
                </tr>
              ) : incidents.length > 0 ? (
                incidents.map((inc) => {
                  const dateObj = new Date(inc.createdAt);
                  const formattedDate = dateObj.toLocaleDateString('pt-PT');
                  const formattedTime = dateObj.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
                  const reporterName = inc.Reporter?.name || inc.User?.name || 'Desconhecido';
                  const companyName = inc.Company?.name || 'Sem Empresa';

                  return (
                    <tr key={inc.id}>
                      <td className="px-4 py-3 font-monospace text-muted">
                        <div className="fw-bold text-dark">#INC-{inc.id.toString().padStart(4, '0')}</div>
                        <small style={{ fontSize: '0.75rem' }}>{formattedDate} {formattedTime}</small>
                      </td>
                      {/* Relações carregadas pelo backend: empresa e utilizador reportador. */}
                      <td className="py-3">
                        <div className="fw-bold text-dark mb-1">
                          <FontAwesomeIcon icon={faBuilding} className="text-muted me-2" style={{fontSize: '0.8rem'}} />
                          {companyName}
                        </div>
                        <div className="text-muted small">
                          <FontAwesomeIcon icon={faUserTie} className="me-2" style={{fontSize: '0.8rem'}} />
                          {reporterName}
                        </div>
                      </td>
                      <td className="py-3 fw-medium text-dark">
                        {inc.title}
                      </td>
                      <td className="py-3">
                        {getSeverityBadge(inc.severity)}
                      </td>
                      <td className="py-3">
                        {getStatusBadge(inc.status)}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="rounded-3 shadow-sm border"
                          onClick={() => navigate(`/portal/incidentes/${inc.id}`)}
                        >
                          <FontAwesomeIcon icon={faEye} className="text-primary me-1" /> Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Não existem incidentes reportados no histórico.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ListaIncidentes;
