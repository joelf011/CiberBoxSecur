import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { incidentsApi } from '../../api/incidentsApi';
import { Alerts } from '../../utils/Alerts';

const NovoIncidente = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    title: '',
    severity: 'Medium',
    incidentType: '',
    description: '',
    affectedUsers: 1,
    assetType: ''
  });

  const severityOptions = [
    { value: 'Residual', label: 'Residual' },
    { value: 'Low', label: 'Baixa' },
    { value: 'Medium', label: 'Média' },
    { value: 'High', label: 'Alta' },
    { value: 'Critical', label: 'Crítica' }
  ];
  
  // Como estes vão para o JSONB
  const typeOptions = ['Phishing', 'Malware', 'Ransomware', 'DDoS', 'Violação de Dados', 'Exploração de Vulnerabilidades', 'DDoS', 'Man-in-the-Middle', 'Zero-Day'];
  const assetOptions = ['Servidor', 'Postos', 'Storage', 'UPS', 'Switch', 'Firewall', 'Disco Externo', 'NAS'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Empacotar os dados para o Backend
      const payload = {
        title: formData.title,
        severity: formData.severity,
        status: 'Open', 
        cncs_form_data: {
          incident_type: formData.incidentType,
          description: formData.description,
          affected_users: formData.affectedUsers,
          asset_type: formData.assetType,
          report_date: new Date().toISOString()
        }
      };

      await incidentsApi.createIncident(payload);
      Alerts.success('Incidente reportado com sucesso! A nossa equipa técnica foi notificada.');
      
      // Redireciona para o histórico
      navigate('/admin/incidentes'); 
    } catch (error) {
      Alerts.error(error.response?.data?.error || 'Erro ao reportar o incidente. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in py-2 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" /> 
            Reportar Novo Incidente
          </h2>
          <p className="text-muted small">Forneça os detalhes básicos do evento de segurança para iniciarmos a investigação.</p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Voltar
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4 p-md-5">
          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Resumo do Incidente */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Título (Resumo)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title"
                    placeholder="ex: Suspeita de email de Phishing no Dpto. Financeiro"
                    required 
                    className="bg-light border-0 py-2" 
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Criticidade e Tipo */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Criticidade Inicial</Form.Label>
                  <Form.Select 
                    name="severity"
                    className="bg-light border-0 py-2"
                    value={formData.severity}
                    onChange={handleChange}
                  >
                    {severityOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Tipo de Incidente</Form.Label>
                  <Form.Select 
                    name="incidentType"
                    required
                    className="bg-light border-0 py-2"
                    value={formData.incidentType}
                    onChange={handleChange}
                  >
                    <option value="">Selecione o tipo...</option>
                    {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Ativos e Utilizadores */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Ativo Principal Afetado</Form.Label>
                  <Form.Select 
                    name="assetType"
                    required
                    className="bg-light border-0 py-2"
                    value={formData.assetType}
                    onChange={handleChange}
                  >
                    <option value="">Selecione o ativo...</option>
                    {assetOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Nº Estimado de Utilizadores Afetados</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="affectedUsers"
                    min="1"
                    className="bg-light border-0 py-2" 
                    value={formData.affectedUsers}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Descrição Detalhada */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Descrição Detalhada</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    name="description"
                    rows={4}
                    placeholder="Descreva o que aconteceu, se notou alguma atividade suspeita ou mensagens de erro..."
                    required
                    className="bg-light border-0 py-2" 
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Botão de Submissão */}
              <Col md={12} className="d-flex justify-content-end mt-4">
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="px-5 py-2 fw-bold shadow-sm" 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <><Spinner size="sm" className="me-2" /> A reportar...</>
                  ) : (
                    <><FontAwesomeIcon icon={faPaperPlane} className="me-2" /> Reportar Incidente</>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NovoIncidente;