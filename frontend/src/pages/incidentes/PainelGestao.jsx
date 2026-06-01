import React, { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSave } from '@fortawesome/free-solid-svg-icons';
import { incidentsApi } from '../../api/incidentsApi';
import { Alerts } from '../../utils/Alerts';

const PainelGestao = ({ incident, onUpdateSuccess }) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // O estado inicial puxa o que já está na DB
  const [formData, setFormData] = useState({
    status: incident.status || 'Open',
    severity: incident.severity || 'Medium',
    attackerIp: incident.cncs_form_data?.attacker_ip || '',
    logAnalysis: incident.cncs_form_data?.log_analysis || '',
    correctiveMeasures: incident.cncs_form_data?.corrective_measures || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      const updatedPayload = {
        status: formData.status,
        severity: formData.severity,
        cncs_form_data: {
          ...incident.cncs_form_data, 
          attacker_ip: formData.attackerIp,
          log_analysis: formData.logAnalysis,
          corrective_measures: formData.correctiveMeasures,
          updated_by_admin_id: loggedInUser.id
        }
      };

      await incidentsApi.updateIncident(incident.id, updatedPayload);
      Alerts.success('Incidente atualizado com sucesso!');
      
      // Avisa a página pai que gravou com sucesso para ela recarregar os dados
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      Alerts.error('Erro ao atualizar o incidente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4 border-start border-primary border-4 h-100">
      <h4 className="fs-5 fw-bold text-dark mb-4">
        <FontAwesomeIcon icon={faLock} className="text-danger me-2" />
        Painel de Gestão (Equipa Técnica)
      </h4>
      
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-bold text-secondary">Estado</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange} className="bg-light border-0">
                <option value="Open">Aberto</option>
                <option value="Investigating">Em Investigação</option>
                <option value="Mitigated">Mitigado</option>
                <option value="Resolved">Resolvido</option>
                <option value="Closed">Fechado</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="small fw-bold text-secondary">Criticidade</Form.Label>
              <Form.Select name="severity" value={formData.severity} onChange={handleChange} className="bg-light border-0">
                <option value="Low">Baixa</option>
                <option value="Medium">Média</option>
                <option value="High">Alta</option>
                <option value="Critical">Crítica</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label className="small fw-bold text-secondary">Notas Técnicas / Mitigação</Form.Label>
              <Form.Control 
                as="textarea" rows={3} name="correctiveMeasures" value={formData.correctiveMeasures} onChange={handleChange}
                placeholder="O que foi feito para tratar este incidente?" className="bg-light border-0"
              />
            </Form.Group>
          </Col>

          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button variant="primary" type="submit" className="fw-bold px-4" disabled={isSaving}>
              {isSaving ? 'A guardar...' : <><FontAwesomeIcon icon={faSave} className="me-2" /> Gravar Alterações</>}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default PainelGestao;