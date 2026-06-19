import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBuilding, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { incidentsApi } from '../../api/incidentsApi';
import { Alerts } from '../../utils/Alerts';

// Micro-componentes separam a visão do cliente da gestão técnica.
import ResumoCliente from './ResumoCliente';
import PainelGestao from './PainelGestao';

/**
 * Responsável por:
 * - Carregar o detalhe de um incidente por ID.
 * - Mostrar painel técnico apenas a utilizadores com permissão de atualização.
 *
 * Fluxo:
 * Rota /incidentes/:id -> incidentsApi -> ResumoCliente/PainelGestao -> Atualização.
 */
const DetalhesIncidente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const hasEditPermission = loggedInUser.permissions?.includes('UPDATE_INCIDENT');

  const fetchIncidentDetails = async () => {
    try {
      setLoading(true);
      const data = await incidentsApi.getIncidentById(id);
      setIncident(data);
    } catch (err) {
      Alerts.error('Erro ao carregar detalhes do incidente.');
      navigate('/portal/incidentes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentDetails();
  }, [id]);

  if (loading || !incident) {
    return (
      <div className="text-center py-5 text-muted">
        <Spinner animation="border" size="sm" className="me-2" /> A carregar o ticket...
      </div>
    );
  }

  // Relações opcionais podem chegar com aliases diferentes conforme a query do backend.
  const reporterName = incident.Reporter?.name || incident.User?.name || 'Desconhecido';
  const companyName = incident.Company?.name || 'Empresa Desconhecida';

  return (
    <div className="animate-fade-in py-2 max-w-5xl mx-auto">
      {/* Navegação de retorno ao histórico filtrado no backend. */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/portal/incidentes')}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Voltar ao Histórico
        </Button>
        <div className="text-muted small fw-bold font-monospace">Ticket #INC-{incident.id.toString().padStart(4, '0')}</div>
      </div>

      {/* Contexto carregado das relações Company/User do incidente. */}
      <div className="mb-4 d-flex gap-3 flex-wrap">
         <Badge bg="white" text="dark" className="border px-3 py-2 fs-6 shadow-sm fw-medium">
             <FontAwesomeIcon icon={faBuilding} className="text-primary me-2"/>
             {companyName}
         </Badge>
         <Badge bg="white" text="dark" className="border px-3 py-2 fs-6 shadow-sm fw-medium">
             <FontAwesomeIcon icon={faUserTie} className="text-secondary me-2"/>
             Reportado por: {reporterName}
         </Badge>
      </div>

      <Row className="g-4">
        {/* Resumo visível a cliente e equipa técnica. */}
        <Col lg={hasEditPermission ? 6 : 12}>
          <ResumoCliente incident={incident} />
        </Col>

        {/* Área técnica só aparece para quem pode atualizar incidentes. */}
        {hasEditPermission && (
          <Col lg={6}>
            <PainelGestao incident={incident} onUpdateSuccess={fetchIncidentDetails} />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DetalhesIncidente;
