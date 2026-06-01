import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'; // Adicionei um ícone novo aqui

const ResumoCliente = ({ incident }) => {
  if (!incident) return null;

  // Variável para facilitar a leitura se existem notas técnicas
  const medidas = incident.cncs_form_data?.corrective_measures;

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
      <h4 className="fs-5 fw-bold text-dark mb-4">
        <FontAwesomeIcon icon={faShieldAlt} className="text-primary me-2" />
        Informações do Incidente
      </h4>
      
      <div className="mb-3">
        <label className="text-muted small fw-bold text-uppercase d-block">Título / Resumo</label>
        <span className="text-dark fw-medium fs-5">{incident.title}</span>
      </div>

      <Row className="mb-3 g-2">
        <Col xs={6}>
          <label className="text-muted small fw-bold text-uppercase d-block">Criticidade Inicial</label>
          <Badge bg="secondary">{incident.severity}</Badge>
        </Col>
        <Col xs={6}>
          <label className="text-muted small fw-bold text-uppercase d-block">Estado Atual</label>
          <Badge bg="primary">{incident.status}</Badge>
        </Col>
      </Row>

      <Row className="mb-3 g-2">
        <Col xs={6}>
          <label className="text-muted small fw-bold text-uppercase d-block">Tipo de Incidente</label>
          <span className="text-dark">{incident.cncs_form_data?.incident_type || 'N/A'}</span>
        </Col>
        <Col xs={6}>
          <label className="text-muted small fw-bold text-uppercase d-block">Ativo Afetado</label>
          <span className="text-dark">{incident.cncs_form_data?.asset_type || 'N/A'}</span>
        </Col>
      </Row>

      <div className="mb-3">
        <label className="text-muted small fw-bold text-uppercase d-block">Nº Utilizadores Afetados</label>
        <span className="text-dark">{incident.cncs_form_data?.affected_users || 0}</span>
      </div>

      <div className="mb-3">
        <label className="text-muted small fw-bold text-uppercase d-block">Descrição Inicial do Cliente</label>
        <div className="bg-light p-3 rounded-3 text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
          {incident.cncs_form_data?.description || 'Sem descrição detalhada.'}
        </div>
      </div>

      {/* Feedback */}
      <div className="mt-4 pt-4 border-top border-light">
        <label className="text-primary small fw-bold text-uppercase d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faClipboardCheck} className="me-2 fs-6" />
          Medidas Tomadas
        </label>
        
        <div 
          className={`p-3 rounded-3 shadow-sm ${medidas ? 'bg-primary bg-opacity-10 text-dark border border-primary border-opacity-25' : 'bg-light text-muted fst-italic border border-light'}`} 
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {medidas || 'A aguardar avaliação e medidas por parte da equipa técnica.'}
        </div>
      </div>

    </Card>
  );
};

export default ResumoCliente;