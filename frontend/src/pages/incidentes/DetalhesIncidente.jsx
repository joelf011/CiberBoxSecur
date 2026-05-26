import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { incidentsApi } from '../../api/incidentsApi';
import { Alerts } from '../../utils/Alerts';

// Importar os nossos novos micro-componentes
import ResumoCliente from './ResumoCliente';
import PainelGestao from './PainelGestao';

const DetalhesIncidente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. LÓGICA DE PERMISSÕES DA TUA IMAGEM
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');

  console.log("Dados do Utilizador:", loggedInUser);
  console.log("É Admin ou Gestor?", loggedInUser.Role?.name === 'ADMIN' || loggedInUser.Role?.name === 'MANAGER');
  
  // Como tens o sistema de permissões ativado (aquela imagem dos botões on/off),
  // se o utilizador for 'ADMIN' ou 'MANAGER', ele tem permissão para "Editar".
  // Se for cliente, não tem.
  const hasEditPermission = loggedInUser.permissions?.includes('UPDATE_INCIDENT');

  const fetchIncidentDetails = async () => {
    try {
      setLoading(true);
      const data = await incidentsApi.getIncidentById(id);
      setIncident(data);
    } catch (err) {
      Alerts.error('Erro ao carregar detalhes do incidente.');
      navigate('/admin/incidentes');
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

  return (
    <div className="animate-fade-in py-2 max-w-5xl mx-auto">
      {/* Botão Voltar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin/incidentes')}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Voltar ao Histórico
        </Button>
        <div className="text-muted small">Ticket #INC-{incident.id.toString().padStart(4, '0')}</div>
      </div>

      <Row className="g-4">
        {/* COLUNA ESQUERDA: Sempre visível (Para todos que tenham a permissão "Visualizar") */}
        <Col lg={hasEditPermission ? 6 : 12}>
          <ResumoCliente incident={incident} />
        </Col>

        {/* COLUNA DIREITA: Visível apenas se tiver a permissão "Editar" da tua grelha */}
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